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
