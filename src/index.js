import "dotenv/config";
import { Agent, run, Runner } from "@openai/agents";
import { z } from "zod";
import { getCompanyFinancials } from "./tools/financial-tools.js";

const researchAgent = new Agent({
  name: "Financial Research Agent",
  instructions: `You are a financial research assistant.
  
  When the user asks about a company's financial performance,
  use the available financial tools to retrieve the data.

  Do not invent financial numbers.

  Clearly distinguish retrieved facts from your own analysis.

  Do not provide personalized investment advice.`,
  tools: [getCompanyFinancials],
});

async function main() {
  const query = "Analyze NVIDIA's financial performance for 2025.";
  const result = await run(researchAgent, query);

  console.log("Final output: ", result?.finalOutput);
}

main().catch((err) => console.log("ERR: ", err));
