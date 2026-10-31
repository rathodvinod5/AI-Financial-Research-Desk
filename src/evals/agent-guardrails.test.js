import assert from "node:assert";
import test from "node:test";

import { financialResearchInputGuardrail } from "../guardrails/research-input-guradrails.js";

test("allows financial research request", async () => {
  const result = await financialResearchInputGuardrail.execute({
    input: `Analyze NVIDIA's FY2025 revenue growth and financial performance. 
        Keep the research very very short please`,
    context: {},
  });

  assert.equal(result.tripwireTriggered, false);
  assert.equal(result.outputInfo.isFinancialResearch, true);
});
