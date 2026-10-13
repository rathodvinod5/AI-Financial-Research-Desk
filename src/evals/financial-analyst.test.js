import "dotenv/config";

import assert from "node:assert/strict";
import test from "node:test";
import { run } from "@openai/agents";

import { financialAnalystAgent } from "../agents/financial-analyst.js";
import { createResearchContext } from "../context/research-context.js";

import { financialReserachOutput } from "../schemas/research-output.js";

const query = `Analyze NVIDIA's financial performance. Use the available tools 
  and do not invent numbers.`;

test("Financial Analyst retrieves financial data", async () => {
  const context = createResearchContext({
    researchId: "test-financial-analyst",
    userId: "test-user",
    company: "NVIDIA",
  });

  const result = await run(financialAnalystAgent, query, {
    context,
  });

  const toolNames = (result?.newItems ?? [])
    .filter((item) => item.type === "tool_call_item")
    .map((item) => item.rawItem)
    .filter((rawItem) => rawItem.type === "function_call")
    .map((rawItem) => rawItem.name);

  console.log("Tool calls:", toolNames);
  console.log("Structured output:", result.finalOutput);

  // =======================================================================
  // A. Test whether the get_company_financials tool called
  assert.ok(
    toolNames.includes("get_company_financials"),
    "Financial Analyst should retrieve company financials",
  );
  assert.ok(result.finalOutput, "Financial Analyst should return output");

  //   console.log("Parsed output: ");
  //   console.dir(result.finalOutput, { depth: null });

  // =======================================================================
  // B. Test whether the agent returned intended structured output
  const parsed = financialReserachOutput.safeParse(result?.finalOutput);
  assert.ok(
    parsed.success,
    `Invalid structured output: ${JSON.stringify(parsed.error?.issues ?? [])}`,
  );

  assert.equal(parsed.data.company, "NVIDIA");
  assert.equal(typeof parsed.data.financialSummary.revenue, "string");
  assert.equal(typeof parsed.data.financialSummary.revenueGrowth, "number");
  assert.ok(Array.isArray(parsed.data.findings), "Findings must be an array");
  assert.ok(parsed.data.riskFlag, "Risk flags must be an array");

  console.log("Structured output validation: PASS");
});
