import "dotenv/config";

import assert from "node:assert/strict";
import test from "node:test";
import { run } from "@openai/agents";

import { financialAnalystAgent } from "../agents/financial-analyst.js";
import { createResearchContext } from "../context/research-context.js";

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

  //   const toolNames = (result?.newItems ?? [])
  //     .filter((item) => item.type === "tool_call_item")
  //     .map((item) => item.rawItem?.name?.name ?? item.rawItem?.name)
  //     .filter((name) => typeof name === "string");

  const toolNames = (result?.newItems ?? [])
    .filter((item) => item.type === "tool_call_item")
    .map((item) => item.rawItem)
    .filter((rawItem) => rawItem.type === "function_call")
    .map((rawItem) => rawItem.name);

  console.log("Tool calls:", toolNames);
  console.log("Structured output:", result.finalOutput);

  assert.ok(
    toolNames.includes("get_company_financials"),
    "Financial Analyst should retrieve company financials",
  );

  assert.ok(result.finalOutput, "Financial Analyst should return output");
});
