import test from "node:test";
import assert from "node:assert";
import { assistantMessage, ScriptedModel } from "@openai/agents/testing";
import { functionCall } from "@openai/agents/testing";
import { Runner } from "@openai/agents";
import { financialAnalystAgent } from "../agents/financial-analyst.js";
import { financialResearchOutput } from "../schemas/research-output.js";

test("Financial Analyst handles unavailable company data", async () => {
  const model = new ScriptedModel([
    [
      functionCall(
        "get_company_financials",
        { company: "UNKNOWN_CORP", year: 2025 },
        { callId: "call_missing_financials" },
      ),
    ],
    [
      functionCall(
        "get_market_data",
        { company: "UNKNOWN_CORP" },
        { callId: "call_missing_market" },
      ),
    ],
    [
      assistantMessage(
        JSON.stringify({
          dataAvailable: false,
          company: "UNKNOWN_CORP",
          financialYear: null,
          financialSummary: null,
          marketSummary: null,
          dataUnavailableReason:
            "Financial and market data are unavailable for UNKNOWN_CORP.",
          findings: [],
          riskFlags: ["Required financial and market data are unavailable."],
        }),
      ),
    ],
  ]);

  test.after(() => model.assertComplete());

  const runner = new Runner({
    model,
    tracingDisabled: true,
  });

  const result = await runner.run(
    financialAnalystAgent,
    "Analyze UNKNOWN_CORP for FY2025. Do not invent missing metrics.",
    {
      context: {
        researchId: "deterministic-test-002",
        userId: "test-user",
        logger: {
          info() {},
        },
      },
    },
  );

  const parsed = financialResearchOutput.safeParse(result.finalOutput);
  assert.ok(
    parsed.success,
    `Output schema validation failed: ${JSON.stringify(parsed.error?.issues)}`,
  );

  if (!parsed.success) return;

  assert.equal(parsed.data.dataAvailable, false);
  assert.equal(parsed.data.company, "UNKNOWN_CORP");
  assert.equal(parsed.data.financialSummary, null);
  assert.equal(parsed.data.financialYear, null);
  assert.equal(parsed.data.marketSummary, null);
});
