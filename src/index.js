import "dotenv/config";
import { Agent, MemorySession, run, Runner } from "@openai/agents";
import { z } from "zod";
import {
  getCompanyFinancials,
  getMarketData,
} from "./tools/financial-tools.js";
import { createResearchContext } from "./context/research-context.js";
import { financialReserachOutput } from "./schemas/research-output.js";
import { financialAnalystAgent } from "./agents/financial-analyst.js";
import { researchManagerAgent } from "./agents/research-manager.js";
import { MyRunHooks } from "./hooks/agent-listeners.js";

// const researchAgent = new Agent({
//   name: "Financial Research Agent",
//   instructions: `You are a financial research assistant.

//     Your job is to analyze a company's financial and market data.

//     Use get_company_financials when financial performance
//     information is required.

//     Use get_market_data when market information is required.

//     Never invent financial or market numbers.

//     Based only on the retrieved data
//     1. Summarize the companies financial performance
//     2. Summarise it's market information
//     3. Indentify important findings
//     4. Indentify potential risk flags

//     Do not provide personalised investment advice.

//     return the result using the required structured format`,
//   tools: [getCompanyFinancials, getMarketData],
//   outputType: financialReserachOutput,
// });

async function main() {
  const researchContext = createResearchContext({
    researchId: "research-001",
    userId: "user-123",
    company: "NVIDIA",
  });

  const session = new MemorySession({
    sessionId: "research-session-001",
  });

  let query = `Analyze NVIDIA's financial performance for 2025.`;
  const firstResult = await run(researchManagerAgent, query, {
    context: researchContext,
    session,
    // hooks: new MyRunHooks(),
  });

  console.log(
    "\n" + "=".repeat(40) + "Financial Research Desk" + "=".repeat(40),
  );
  console.log("\nQuery 1: ", query);
  console.log("Assistant:\n");
  console.log(
    typeof firstResult.finalOutput === "string"
      ? firstResult.finalOutput.replace(/\\n/g, "\n")
      : JSON.stringify(firstResult.finalOutput, null, 2),
  );

  query = "What were the main financial risks you identified?";
  console.log("\nQuery 2: ", query);
  const secondResult = await run(researchManagerAgent, query, {
    context: researchContext,
    session,
  });

  console.log("\nAssistant:\n");
  console.log(
    typeof secondResult.finalOutput === "string"
      ? secondResult.finalOutput.replace(/\\n/g, "\n")
      : JSON.stringify(secondResult.finalOutput, null, 2),
  );
}

main().catch((err) => console.log("ERR: ", err));
