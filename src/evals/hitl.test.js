import test from "node:test";
import assert from "node:assert";

import { Agent, Runner } from "@openai/agents";
import {
  ScriptedModel,
  functionCall,
  assistantMessage,
} from "@openai/agents/testing";

import { publishResearchReport } from "../tools/report-tools.js";

function createTestContext() {
  //   return {
  //     researchId: "hitl-test-001",
  //     userId: "test-user",
  //     company: "NVIDIA",
  //     logger: {
  //       info() {},
  //     },
  //   };

  const tracker = {
    publishExecutions: 0,
  };

  const context = {
    researchId: "hitl-test-001",
    userId: "test-user",
    company: "NVIDIA",
    logger: {
      info() {
        tracker.publishExecutions++;
      },
    },
  };

  return { context, tracker };
}

function createPublishingAgent() {
  return new Agent({
    name: "HITL Test Agent",
    instructions: `
        You are a research publishing assistant.
        Use publish_research_report when asked to publish a report.
        Do not claim a report was published unless the tool succeeds.
        `,
    tools: [publishResearchReport],
  });
}

test("publishing pauses and requests human approval", async () => {
  const model = new ScriptedModel([
    [
      functionCall(
        "publish_research_report",
        {
          company: "NVIDIA",
          report: "NVIDIA FY2025 financial research report",
          destination: "research_workspace",
        },
        { callId: "call_publish_001" },
      ),
    ],
  ]);

  const runner = new Runner({
    model,
    tracingDisabled: true,
  });

  const publishingAgent = createPublishingAgent();
  const { context: testContext, tracker } = createTestContext();

  const result = await runner.run(
    publishingAgent,
    "Publish the NVIDIA financial research report.",
    { context: testContext },
  );

  assert.equal(result.interruptions.length, 1);
  assert.equal(tracker.publishExecutions, 0);

  const interruption = result.interruptions[0];
  assert.equal(interruption.name, "publish_research_report");
  assert.equal(model.calls.length, 1);
  model.assertComplete();
});

test("approving publishing executes the tool and resumes the workflow", async () => {
  const model = new ScriptedModel([
    [
      functionCall(
        "publish_research_report",
        {
          company: "NVIDIA",
          report: "NVIDIA FY2025 financial research report",
          destination: "research_workspace",
        },
        { callId: "call_publish_002" },
      ),
    ],
    [
      assistantMessage(
        "The NVIDIA financial research report was successfully published.",
      ),
    ],
  ]);

  const runner = new Runner({
    model,
    tracingDisabled: true,
  });

  const publishingAgent = createPublishingAgent();
  const { context: testContext, tracker } = createTestContext();

  // Step 1: Start the workflow.
  const initialResult = await runner.run(
    publishingAgent,
    "Publish the NVIDIA financial research report.",
    { context: testContext },
  );

  assert.equal(initialResult.interruptions.length, 1);

  // Step 2: Retrieve the pending approval.
  const interruption = initialResult.interruptions[0];

  // Step 3: Approve the pending tool call.
  initialResult.state.approve(interruption);

  const resumedResult = await runner.run(publishingAgent, initialResult.state, {
    context: testContext,
  });

  //   console.dir(
  //     {
  //       finalOutput: resumedResult.finalOutput,
  //       interruptions: resumedResult.interruptions?.map((item) => ({
  //         name: item.name,
  //         arguments: item.arguments,
  //       })),
  //       modelCallCount: model.calls.length,
  //     },
  //     { depth: null },
  //   );

  assert.equal(resumedResult.interruptions.length, 0);
  assert.equal(tracker.publishExecutions, 1);

  assert.equal(
    resumedResult.finalOutput,
    "The NVIDIA financial research report was successfully published.",
  );

  // Initial request + resumed request.
  assert.equal(model.calls.length, 2);

  model.assertComplete();
});

test("rejecting publishing prevents tool execution", async () => {
  const model = new ScriptedModel([
    // Request publishing.
    [
      functionCall(
        "publish_research_report",
        {
          company: "NVIDIA",
          report: "NVIDIA FY2025 financial research report",
          destination: "research_workspace",
        },
        {
          callId: "call_publish_003",
        },
      ),
    ],

    // Respond after receiving the rejection.
    [
      assistantMessage(
        "The publishing request was rejected. The report was not published.",
      ),
    ],
  ]);

  const runner = new Runner({
    model,
    tracingDisabled: true,
  });

  const publishingAgent = createPublishingAgent();
  const { context: testContext, tracker } = createTestContext();

  const initialResult = await runner.run(
    publishingAgent,
    "Publish the NVIDIA financial research report.",
    { context: testContext },
  );

  assert.equal(initialResult.interruptions.length, 1);

  const interruption = initialResult.interruptions[0];
  initialResult.state.reject(interruption);

  // Step 3: Resume workflow.
  const resumedResult = await runner.run(publishingAgent, initialResult.state, {
    context: testContext,
  });

  // Step 4: Verify publishing never executed.
  assert.equal(tracker.publishExecutions, 0);

  assert.equal(resumedResult.interruptions.length, 0);

  assert.equal(
    resumedResult.finalOutput,
    "The publishing request was rejected. The report was not published.",
  );

  model.assertComplete();
});

test("input guardrail rejects an unauthorized destination even after human approval", async () => {
  const model = new ScriptedModel([
    [
      // First response: request publishing.
      functionCall(
        "publish_research_report",
        {
          company: "NVIDIA",
          report: "NVIDIA FY2025 financial research report",
          destination: "external_workspace",
        },
        {
          callId: "call_publish_004",
        },
      ),
    ],

    // Second response: respond after the guardrail rejection.
    [
      assistantMessage(
        "Publishing was blocked because the destination is not authorized.",
      ),
    ],
  ]);

  const runner = new Runner({
    model,
    tracingDisabled: true,
  });

  const publishingAgent = createPublishingAgent();
  const { context: testContext, tracker } = createTestContext();

  const initialResult = await runner.run(
    publishingAgent,
    "Publish the NVIDIA report to the external workspace.",
    { context: testContext },
  );

  assert.equal(initialResult.interruptions.length, 1);

  const interruption = initialResult.interruptions[0];

  // Step 2: Human approves the request.
  initialResult.state.approve(interruption);

  // Step 3: Resume the workflow.
  const resumedResult = await runner.run(publishingAgent, initialResult.state, {
    context: testContext,
  });

  // Step 4: Verify the input guardrail blocked execution.
  assert.equal(tracker.publishExecutions, 0);
  assert.equal(resumedResult.interruptions.length, 0);
  model.assertComplete();
});

test("multiple publishing requests require separate approvals", async () => {
  const model = new ScriptedModel([
    [
      functionCall(
        "publish_research_report",
        {
          company: "NVIDIA",
          report: "NVIDIA FY2025 financial research report",
          destination: "research_workspace",
        },
        { callId: "call_publish_005" },
      ),
    ],
    [
      functionCall(
        "publish_research_report",
        {
          company: "Apple",
          report: "Apple FY2025 financial research report",
          destination: "research_workspace",
        },
        { callId: "call_publish_006" },
      ),
    ],
    [
      assistantMessage(
        "Both NVIDIA and Apple research reports were published successfully.",
      ),
    ],
  ]);

  const runner = new Runner({
    model,
    tracingDisabled: true,
  });

  const publishingAgent = createPublishingAgent();
  const { context: testContext, tracker } = createTestContext();

  const firstRun = await runner.run(
    publishingAgent,
    "Publish the NVIDIA and Apple research reports.",
    {
      context: testContext,
    },
  );

  assert.equal(firstRun.interruptions.length, 1);
  assert.equal(tracker.publishExecutions, 0);

  // Approve NVIDIA.
  firstRun.state.approve(firstRun.interruptions[0]);

  const secondRun = await runner.run(publishingAgent, firstRun.state, {
    context: testContext,
  });

  // Second publishing request should now require approval.
  assert.equal(secondRun.interruptions.length, 1);
  assert.equal(tracker.publishExecutions, 1);

  // // Approve Apple.
  secondRun.state.approve(secondRun.interruptions[0]);

  const finalResult = await runner.run(publishingAgent, secondRun.state, {
    context: testContext,
  });

  assert.equal(finalResult.interruptions.length, 0);
  assert.equal(tracker.publishExecutions, 2);

  assert.equal(
    finalResult.finalOutput,
    "Both NVIDIA and Apple research reports were published successfully.",
  );

  model.assertComplete();
});
