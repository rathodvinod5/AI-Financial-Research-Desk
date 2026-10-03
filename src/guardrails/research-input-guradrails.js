import { Agent, run } from "@openai/agents";
import { z } from "zod";

export const researchScopeAgent = new Agent({
  name: "Research Scope Checker",
  instructions: `
  You are a scope checker for AI Financial Research Desk.

  Determine whether the user's request is related to financial and 
  investment research about the companies, market, stocks, financial valuation,
  business development, competition or related financial topics.

  Examples of valid requests:
  - Analyse NVIDIA's revenue growth
  - What is Apple's market capitalisation
  - Research NVIDIA's recent business developments
  - Compare apples financial performance
  - What are the risks NVIDIA is facing?
  - Analyse the stock market performance of the company

  Examples of invalid requests:
  - Write me python code or any other programming language code
  - Tell me joke
  - Help me to plan for a vacation
  - Translate this sentence
  - What is the weather today?
  - Write me a React component

  Return true only when the request is reasonably related to 
  fianacial/company/market research.

  Do not perform actual result, Only specify the request.
  `,
  outputType: z.object({
    isFinancialResearch: z.boolean(),
    reasoning: z.string(),
  }),
});

export const financialResearchInputGuardrail = {
  name: "Financial Research Scope",
  runInParallel: false,
  execute: async ({ input, context }) => {
    const result = await run(researchScopeAgent, input, {
      context,
    });

    return {
      outputInfo: result?.finalOutput,
      tripwireTriggered: result?.finalOutput?.isFinancialResearch == false,
    };
  },
};
