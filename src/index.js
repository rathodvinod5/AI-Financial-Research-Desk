import "dotenv/config";
import { Agent, run, Runner } from "@openai/agents";
import { z } from "zod";

const researchAgent = new Agent({
  name: "Financial Research Agent",
  instructions: `You are a financial research assistant
  
  Your job is to help users about publicly available financial and business information
  
  Do not provide personalised investment advice
  Clearly distinguish facts from analysis.
  Keep you answers consinse and structured.`,
});

async function main() {
  const query = "Explain what revenue growth means when analyzing a company.";
  const result = await run(researchAgent, query);

  console.log("Final output: ", result?.finalOutput);
}

main().catch((err) => console.log("ERR: ", err));
