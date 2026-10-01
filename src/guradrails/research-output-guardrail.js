import { Agent, run } from "@openai/agents";
import { z } from "zod";

export const researchOutputCheckerAgent = new Agent({
  name: "Research Output Checker",
  instructions: `
  You are the final quality and safety checker
  for an AI Financial Research Desk.

  Evaluate the financial research response you receive.

  The response must satisfy ALL of these requirements:

  1. It must not invent financial or market numbers.
  2. It must not provide personalized investment advice.
  3. It must not tell the user to buy, sell, or hold a security.
  4. It must not make unsupported claims of certainty.
  5. It should distinguish factual information from analysis.
  6. It should remain within the scope of financial/company research.

  Mark the response as valid only if it satisfies these
  requirements.

  Be conservative when deciding whether the response
  should be blocked.
  `,
  outputType: z.object({
    isValid: z.boolean(),
    reasoning: z.string(),
    voilations: z.array(z.string()),
  }),
});

export const financialResearchOutputGuardrail = {
  name: "Financial Research Output Safety",
  runInParallel: false,
  execute: async ({ agentOutput, context }) => {
    const output =
      typeof agentOutput == "string"
        ? agentOutput
        : JSON.stringify(agentOutput);

    const result = await run(researchOutputCheckerAgent, output, {
      context,
    });

    const decision = result?.finalOutput;

    return {
      outputInfo: decision,
      tripwireTriggered: decision?.isValid == false,
    };
  },
};
