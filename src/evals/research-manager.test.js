import test from "node:test";
import assert from "node:assert/strict";
import { Agent, Runner } from "@openai/agents";
import {
  ScriptedModel,
  functionCall,
  assistantMessage,
} from "@openai/agents/testing";

import { financialAnalystAgent } from "../agents/financial-analyst.js";

function createTestContext() {
  const tracker = {
    financialToolCalls: 0,
    marketToolCalls: 0,
  };

  const context = {
    researchId: "workflow-test-007",
    userId: "test-user",
    company: "NVIDIA",
    logger: {
      info(message) {
        if (message.includes("fetching financial data")) {
          tracker.financialToolCalls++;
        }

        if (message.includes("fetching market data")) {
          tracker.marketToolCalls++;
        }
      },
    },
  };

  return { context, tracker };
}

function createTestResearchManager() {
  const financialAnalystAsTool = financialAnalystAgent.asTool({
    toolName: "financial_analysis",
    toolDescription:
      "Delegate financial and market analysis to the Financial Analyst.",
  });

  return new Agent({
    name: "Test Research Manager",
    instructions: `
      You are a financial research manager.
      Use financial_analysis for company financial metrics and market data.
      Summarize the specialist's findings for the user.
      Never invent financial numbers.
    `,
    tools: [financialAnalystAsTool],
  });
}

test("Research Manager delegates financial research to Financial Analyst", async () => {
  const { context, tracker } = createTestContext();
  const agent = createTestResearchManager();

  const model = new ScriptedModel([
    // 1. Research Manager delegates to Financial Analyst.
    [
      functionCall(
        "financial_analysis",
        {
          input:
            "Analyze NVIDIA financial performance and market data for 2025.",
        },
        { callId: "call_financial_analysis" },
      ),
    ],

    // 2. Financial Analyst requests company financials.
    [
      functionCall(
        "get_company_financials",
        {
          company: "NVIDIA",
          year: 2025,
        },
        { callId: "call_company_financials" },
      ),
    ],

    // 3. Financial Analyst requests market data.
    [
      functionCall(
        "get_market_data",
        {
          company: "NVIDIA",
        },
        { callId: "call_market_data" },
      ),
    ],

    // 4. Financial Analyst returns its structured analysis.
    [
      assistantMessage(
        JSON.stringify({
          dataAvailable: true,
          company: "NVIDIA",
          financialYear: 2025,
          financialSummary: {
            revenue: 130.5,
            revenueGrowth: 114,
            grossMargin: 75.0,
            operatingMargin: 61.6,
          },
          marketSummary: {
            ticker: "NVDA",
            price: 182.41,
            marketCap: 4450,
            dailyChangePercent: 1.84,
          },
          dataUnavailableReason: null,
          findings: [
            "NVIDIA reported revenue of USD 130.5 billion in FY2025.",
            "Revenue grew by 114% compared with the previous year.",
            "Gross margin was 75%, while operating margin was 61.6%.",
          ],
          riskFlags: [],
        }),
      ),
    ],

    // 5. Research Manager responds to the user.
    [
      assistantMessage(
        "NVIDIA's FY2025 revenue was USD 130.5 billion, representing 114% growth. Gross margin was 75% and operating margin was 61.6%. Its market capitalization was USD 4.45 trillion, with a share price of USD 182.41 and a daily change of +1.84%.",
      ),
    ],
  ]);

  const runner = new Runner({
    model,
    tracingDisabled: true,
  });

  const result = await runner.run(
    agent,
    "Analyze NVIDIA financial performance and market data for 2025.",
    { context },
  );

  assert.equal(tracker.financialToolCalls, 1);
  assert.equal(tracker.marketToolCalls, 1);

  assert.match(result.finalOutput, /130\.5/);
  assert.match(result.finalOutput, /114%/);
  assert.match(result.finalOutput, /4\.45 trillion/);

  model.assertComplete();
});
