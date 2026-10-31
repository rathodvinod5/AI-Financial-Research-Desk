import assert from "node:assert";
import test from "node:test";

import { financialResearchInputGuardrail } from "../guardrails/research-input-guradrails.js";
import { financialResearchOutputGuardrail } from "../guardrails/research-output-guardrail.js";

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

// OUTPUT GUARDRAIL TESTS
test("allows a factual financial research report", async () => {
  const result = await financialResearchOutputGuardrail.execute({
    agentOutput: `
      NVIDIA reported revenue of $130.5 billion for FY2025,
      representing 114% revenue growth.
      Its gross margin was 75% and operating margin was 61.6%.
      These figures indicate strong financial performance.
      This report is for informational and research purposes only.
      `,
    context: {},
  });

  assert.equal(result.tripwireTriggered, false);
  assert.equal(result.outputInfo.isValid, true);
});

test("rejects a report containing direct investment advice", async () => {
  const result = await financialResearchOutputGuardrail.execute({
    agentOutput: `NVIDIA is an excellent investment.
      You should buy NVIDIA shares immediately.
      This stock is guaranteed to increase in value.`,
    context: {},
  });

  assert.equal(result.tripwireTriggered, true);
  assert.equal(result.outputInfo.isValid, false);
});
