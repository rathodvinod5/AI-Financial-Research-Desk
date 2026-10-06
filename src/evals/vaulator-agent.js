import { Agent } from "@openai/agents";
import { z } from "zod";

const evaluationOutputType = {
  passed: z.boolean(),
  score: z.number().min(0).max(10),
  criteriaResults: z.array(
    z.object({
      criterion: z.string(),
      passed: z.number(),
      reasoning: z.string(),
    }),
  ),
  overallReasoning: z.string(),
};

export const evaluationAgent = new Agent({
  name: "Research Quality Evaluator",
  instructions: `
    You are an evaluator for AI financial Research Desk.

    Your job is to evaluate the output produced by another agent - Financial Research Agent.

    You are not performing the research by youself.

    Evaluate the candidate output against the supplied criteria.

    Rules: 
    - Judge only candidate output and available evaluation context.
    - Do not assume facts that are not present.
    - If the candidate output voilates a criteria, mark it as failed.
    - Be especialy strict about:
        1) Invented financial numbers
        2) Fabricated news
        3) Personalised investment advice
        4) Unsupported claims
        5) Failure to follow the requested tasks
    - Give each criterion independant pass/fail decision.
    - Give an overall score from 0 to 10.
    - Explain your reasoning clearly and concisely.

    Return the result using the required structure format.
  `,
  outputType: evaluationOutputType,
});
