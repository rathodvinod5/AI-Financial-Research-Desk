import "dotenv/config";

import assert from "node:assert/strict";
import test from "node:test";
import { run } from "@openai/agents";

import { financialAnalystAgent } from "../agents/financial-analyst.js";
import { createResearchContext } from "../context/research-context.js";
import { financialResearchOutput } from "../schemas/research-output.js";

test("Financial Analyst handles unavailable company data", async () => {
  const company = "UNKNOWN_CORP";

  const context = createResearchContext({
    researchId: "test-missing-financial-data",
    userId: "test-user",
    company,
  });

  const result = await run(
    financialAnalystAgent,
    `Analyze ${company}'s financial performance.
     If the financial data is unavailable, clearly report that
     and do not invent financial metrics.`,
    { context },
  );

  // console.dir(output, { depth: null });

  const parsed = financialResearchOutput.safeParse(result.finalOutput);

  assert.ok(
    parsed.success,
    `Invalid output: ${JSON.stringify(parsed.error?.issues ?? [])}`,
  );

  if (!parsed.success) {
    return;
  }

  const output = parsed.data;

  assert.equal(output.dataAvailable, false);

  if (!output.dataAvailable) {
    assert.ok(
      output.dataUnavailableReason.trim().length > 0,
      "The agent should explain why data is unavailable",
    );

    assert.equal(
      output.financialSummary,
      null,
      "Unavailable financial data should not contain fabricated metrics",
    );
  }

  console.log("Missing-data handling: PASS");
});
