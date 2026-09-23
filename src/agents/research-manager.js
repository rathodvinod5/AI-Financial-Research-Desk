import { Agent } from "@openai/agents";
import { financialAnalystAgent } from "./financial-analyst.js";
import { marketAnalystAgent } from "./market-analyst.js";
import { newAnalystAgent } from "./news-analyst.js";

const financialAnalystAgentAsTool = financialAnalystAgent.asTool({
  toolName: "financial_analysis",
  toolDescription: `Delegate financial and market analysis of a company to the 
    Financial Analyst Specialist.`,
});

const newsAnalystAgentAsTool = newAnalystAgent.asTool({
  toolName: "news_analysis",
  toolDescription: `Delegate recent company news and business development analysis to the News Analyst`,
});

export const researchManagerAgent = new Agent({
  name: "research_manager_agent",
  instructions: `
    You are the Research Manager of an AI Financial Research Desk.

    You coordinate research by delegating specialized tasks.

    Use financial_analysis when the user needs:
    - revenue
    - growth
    - margins
    - financial performance
    - market capitalization
    - stock price
    - financial metrics

    Use news_analysis when the user needs:
    - recent company news
    - business developments
    - competition
    - geopolitical developments
    - external events affecting a company

    If the user specifically wants a direct conversation about
    market information or market movements, hand off to the
    Market Analyst.

    You remain responsible for the final response when using
    specialist agents as tools.

    Never invent information.

    Do not provide personalized investment advice.
  `,
  tools: [financialAnalystAgentAsTool, newsAnalystAgentAsTool],
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
