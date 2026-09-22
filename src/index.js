import "dotenv/config";
import { Agent, run, Runner } from "@openai/agents";
import { z } from "zod";
import {
  getCompanyFinancials,
  getMarketData,
} from "./tools/financial-tools.js";
import { createResearchContext } from "./context/research-context.js";

const researchAgent = new Agent({
  name: "Financial Research Agent",
  instructions: `You are a financial research assistant.

    Use get_company_financials when financial performance
    information is required.

    Use get_market_data when current market information
    is required.

    Never invent financial or market numbers.

    Clearly distinguish facts from analysis.

    Do not provide personalized investment advice.`,
  tools: [getCompanyFinancials, getMarketData],
});

async function main() {
  const researchContext = createResearchContext({
    researchId: "research-001",
    userId: "user-123",
    company: "NVIDIA",
  });
  const query = `Analyze NVIDIA. Give me its 2025 financial performance 
  and current market information.`;
  const result = await run(researchAgent, query, {
    context: researchContext,
  });

  console.log("Final output: ", result?.finalOutput);
}

main().catch((err) => console.log("ERR: ", err));
