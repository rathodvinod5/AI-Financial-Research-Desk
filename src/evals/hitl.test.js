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
