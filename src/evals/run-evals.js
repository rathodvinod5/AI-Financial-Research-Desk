import "dotenv/config";
import { run } from "@openai/agents";
import { createResearchContext } from "../context/research-context.js";
import { evaluationCases } from "./cases.js";
import { researchManagerAgent } from "../agents/research-manager.js";
import { createRunConfig } from "../config/run-config.js";
import { evaluateResult } from "./evaluate-result.js";

async function runEvaluation(testCase) {
  try {
    const researchContext = createResearchContext(
      `eval-${testCase.id}`,
      "test-user",
      "NVIDIA",
    );
    const result = await run(
      researchManagerAgent,
      testCase.input,
      createRunConfig({
        context: researchContext,
        session: undefined,
      }),
    );

    const evaluationResult = await evaluateResult(testCase, result.finalOutput);

    return {
      id: testCase.id,
      input: testCase.input,
      output: result.finalOutput,
      executionPassed: true,
      evaluation: evaluationResult,
    };
  } catch (err) {
    return {
      id: testCase.id,
      input: testCase.input,
      output: null,
      executionPassed: false,
      evaluation: null,
      error: err.message,
    };
  }
}

async function main() {
  console.log("\nAI Financial Research Desk — Evaluations\n");

  for (const testCase of evaluationCases) {
    const result = await runEvaluation(testCase);

    console.log(`\n${result.id}`);
    console.log("--------------------------------");

    console.log(`Input: ${result.input}`);

    if (!result.executionPassed) {
      console.log("Execution: FAIL");
      console.log(`Error: ${result.error}`);
      continue;
    }

    console.log("Execution: PASS");

    console.log(`Evaluation: ${result.evaluation.passed ? "PASS" : "FAIL"}`);

    console.log(`Score: ${result.evaluation.score}/10`);

    console.log("\nCriteria:");

    for (const criterion of result.evaluation.criteriaResults) {
      console.log(`${criterion.passed ? "✓" : "✗"} ${criterion.criterion}`);

      console.log(`  ${criterion.reasoning}`);
    }

    console.log(`\nOverall: ${result.evaluation.overallReasoning}`);
  }
}

main().catch(console.error);
