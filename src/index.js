import "dotenv/config";
import { Agent, run, Runner } from "@openai/agents";
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

const researchAgent = new Agent({
  name: "Financial Research Agent",
  instructions: `You are a financial research assistant.

    Your job is to analyze a company's financial and market data.

    Use get_company_financials when financial performance
    information is required.

    Use get_market_data when market information is required.

    Never invent financial or market numbers.

    Based only on the retrieved data
    1. Summarize the companies financial performance
    2. Summarise it's market information
    3. Indentify important findings
    4. Indentify potential risk flags
    
    Do not provide personalised investment advice.
    
    return the result using the required structured format`,
  tools: [getCompanyFinancials, getMarketData],
  outputType: financialReserachOutput,
});

async function main() {
  const researchContext = createResearchContext({
    researchId: "research-001",
    userId: "user-123",
    company: "NVIDIA",
  });

  const query = `Analyze NVIDIA's recent business developments and news.

    Identify the major developments and explain
    what they could mean for the company.`;

  const result = await run(researchManagerAgent, query, {
    context: researchContext,
    // hooks: new MyRunHooks(),
  });

  console.log("\n--- Financial Research Desk ---\n");
  console.log("Final output: ", JSON.stringify(result.finalOutput, null, 2));
}

main().catch((err) => console.log("ERR: ", err));
