import assert from "node:assert";
import test from "node:test";

import { financialResearchInputGuardrail } from "../guardrails/research-input-guradrails.js";

// INPUT GUARDRAIL TESTS
test("allows financial research request", async () => {
  const result = await financialResearchInputGuardrail.execute({
    input: `Analyze NVIDIA's FY2025 revenue growth and financial performance. 
        Keep the research very very short please`,
    context: {},
  });

  assert.equal(result.tripwireTriggered, false);
  assert.equal(result.outputInfo.isFinancialResearch, true);
});

test("rejects an unrelated request other than research", async () => {
  const result = await financialResearchInputGuardrail.execute({
    input: "Build a React component for a todo list application",
    context: {},
  });

  assert.equal(result.tripwireTriggered, true);
  assert.equal(result.outputInfo.isFinancialResearch, false);
});
