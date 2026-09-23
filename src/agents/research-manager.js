import { Agent } from "@openai/agents";
import { financialAnalystAgent } from "./financial-analyst.js";
import { marketAnalystAgent } from "./market-analyst.js";

const financialAnalystAgentAsTool = financialAnalystAgent.asTool({
  toolName: "financial_analysis",
  toolDescription: `Delegate financial and market analysis of a company to the 
    Financial Analyst Specialist.`,
});

export const researchManagerAgent = new Agent({
  name: "research_manager_agent",
  instructions: `You are an Reseach Manager of an AI Financial Research Desk
  
  Your responsibility is to cordinate financial research.

  When the user asks for companies financial analysis:
  1. Delegate the financial analysis to the Financial Analyst.
  2. Review the specialist's result.
  3. Present the result clearly to the user
  4. Do not invent financial data
  5. Do not provide personalised investment advice

  The Financial Analyst is responsible for retrieving and
  analyzing financial and market data.

  You remain responsible for the final response.
  `,
  tools: [financialAnalystAgentAsTool],
  handoffs: [marketAnalystAgent],
});

researchManagerAgent.on("agent_start", (ctx, agent) => {
  console.log(`\n[Event: agent_start] ${agent.name}`);
});

researchManagerAgent.on("agent_handoff", (ctx, agent) => {
  console.log(`\n🔀[Event: agent_handoff] CRITICAL TRANSITION DETECTED!`);
  console.log(`    Agents: ${agent.name || "Unknown"}`);
});

researchManagerAgent.on("agent_end", (ctx, output) => {
  console.log(
    `\n[Event: agent_end]${researchManagerAgent.name} has finished execution.`,
  );
});
