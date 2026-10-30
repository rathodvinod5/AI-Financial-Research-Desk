import test from "node:test";
import assert from "node:assert";

import {
  publishToolInputGuardrail,
  publishToolOutputGuadrail,
} from "../guardrails/publish-tool-guardarails.js";

test("Allows publishing to research workspace", async () => {
  const result = await publishToolInputGuardrail.run({
    toolCall: {
      type: "function_call",
      callId: "call_publish_001",
      name: "publish_research_report",
      arguments: JSON.stringify({
        destination: "research-workspace",
        report: "NVIDIA financial research report",
      }),
    },
    context: undefined,
    agent: undefined,
  });

  assert.equal(result.behavior.type, "allow");
});

test("rejects publishing to an unauthorized destination", async () => {
  const result = await publishToolInputGuardrail.run({
    toolCall: {
      arguments: JSON.stringify({
        destination: "external-workspace",
        report: "NVIDIA financial research report",
      }),
      type: "function_call",
      callId: "call_publish_001",
      name: "publish_research_report",
    },
    context: undefined,
    agent: undefined,
  });
});

test("allows a successful publishing result", async () => {
  const result = await publishToolOutputGuadrail.run({
    output: {
      success: true,
      reportId: "report-123",
    },
    context: undefined,
    agent: undefined,
    toolCall: undefined,
  });

  assert.equal(result.behavior.type, "allow");
});

test("rejects an unsuccessful publishing result", async () => {
  const result = await publishToolOutputGuadrail.run({
    output: {
      success: false,
      error: "Publishing failed",
    },
    context: undefined,
    agent: undefined,
    toolCall: undefined,
  });

  assert.equal(result.behavior.type, "rejectContent");
});
