import { run } from "@openai/agents";
import { evaluationAgent } from "./vaulator-agent.js";

export async function evaluateResult(testCase, candidateOutput) {
  const evaluationInput = `
    Evaluate the following AI financial Research Desk output response.

    TEST CASE:
    ${testCase.input}

    EVALUATION CRITERIA:
    ${testCase.criteria
      .map((criterion, index) => `${index + 1}. ${criterion}`)
      .join("\n")}

    CANDIDATE OUPUT:
    ${candidateOutput ?? "[No final output was produced]"}

    Evaluate the candidate against every criterion.
    `;

  const result = await run(evaluationAgent, evaluationInput);
  return result.finalOutput;
}
