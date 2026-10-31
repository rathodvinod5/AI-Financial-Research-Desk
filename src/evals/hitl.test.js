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
  return {
    researchId: "hitl-test-001",
    userId: "test-user",
    company: "NVIDIA",
    logger: {
      info() {},
    },
  };
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
  const testContext = createTestContext();

  const result = await runner.run(
    publishingAgent,
    "Publish the NVIDIA financial research report.",
    { context: testContext },
  );

  assert.equal(result.interruptions.length, 1);

  const interruption = result.interruptions[0];
  assert.equal(interruption.name, "publish_research_report");
  assert.equal(model.calls.length, 1);
  model.assertComplete();
});
