import test from "node:test";
import assert from "node:assert";
import { Agent, Runner } from "@openai/agents";
import {
  ScriptedModel,
  functionCall,
  assistantMessage,
} from "@openai/agents/testing";

import {
  getCompanyFinancials,
  getMarketData,
} from "../tools/financial-tools.js";
import { financialResearchOutput } from "../schemas/research-output.js";
import { financialAnalystAgent } from "../agents/financial-analyst.js";

test("Financial Analyst executes tools and returns structured data", async () => {
  const model = new ScriptedModel([
    // Model turn 1: request the financial data tool.
    [
      functionCall(
        "get_company_financials",
        { company: "NVIDIA", financialYear: 2025 },
        { callId: "call_financials_1" },
      ),
    ],

    // Model turn 2: request the market data tool.
    [
      functionCall(
        "get_market_data",
        { ticker: "NVDA" },
        { callId: "call_market_1" },
      ),
    ],

    // Model turn 3: return the final structured output.
    [
      assistantMessage(
        JSON.stringify({
          dataAvailable: true,
          company: "NVIDIA",
          financialYear: 2025,
          financialSummary: {
            revenue: 130.5,
            revenueGrowth: 114,
            grossMargin: 75,
            operatingMargin: 61.6,
          },
          marketSummary: {
            ticker: "NVDA",
            price: 182.41,
            marketCap: 4450,
            dailyChangePercent: 1.84,
          },
          dataUnavailableReason: null,
          findings: ["NVIDIA reported strong revenue growth."],
          riskFlags: [],
        }),
      ),
    ],
  ]);

  // Ensure scripted steps are checked even if an assertion fails.
  test.after(() => model.assertComplete());

  const runner = new Runner({
    model,
    tracingDisabled: true,
  });

  const result = await runner.run(financialAnalystAgent, "", {
    context: {
      researchId: "deterministic-test-001",
      userId: "test-user",
      logger: {
        info() {},
      },
    },
  });

  assert.equal(model.calls.length, 3);

  let toolCalls = model.calls
    .flatMap((call) => {
      const input = call.request.input;

      if (typeof input === "string") {
        return [];
      }

      return input;
    })
    .filter((item) => item.type == "function_call")
    .map((item) => item.name);

  toolCalls = Array.from(new Set(toolCalls));

  assert.deepEqual(toolCalls, ["get_company_financials", "get_market_data"]);

  const parsed = financialResearchOutput.safeParse(result.finalOutput);
  assert.ok(
    parsed.success,
    `Output did not match schema: ${JSON.stringify(parsed.error?.issues)}`,
  );

  if (!parsed.success) return;

  assert.equal(parsed.data.dataAvailable, true);
  assert.equal(parsed.data.company, "NVIDIA");
  assert.equal(parsed.data.financialSummary.revenue, 130.5);
  assert.equal(parsed.data.marketSummary.ticker, "NVDA");
});
