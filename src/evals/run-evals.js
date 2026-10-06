import "dotenv/config";
import { run } from "@openai/agents";
import { createResearchContext } from "../context/research-context.js";
import { evaluationCases } from "./cases.js";
import { researchManagerAgent } from "../agents/research-manager.js";
import { createRunConfig } from "../config/run-config.js";

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

    return {
      id: testCase.id,
      input: testCase.input,
      output: result.finalOutput,
      passed: true,
    };
  } catch (err) {
    return {
      id: testCase.id,
      input: testCase.input,
      output: null,
      passed: false,
      error: err.message,
    };
  }
}

async function main() {
  console.log("\nAI Financial Research Desk — Evaluations\n");

  for (const testCase of evaluationCases) {
    const result = await runEvaluation(testCase);

    if (result.passed) {
      console.log("\nID: ", testCase.id);
      console.log("--------------------------------");
      console.log("Input: ", testCase.input);
      console.log("Status: PASSED");
      console.log("Result: ", result.output);
    } else {
      console.log("\nID: ", testCase.id);
      console.log("--------------------------------");
      console.log("Input: ", testCase.input);
      console.log("Status: FAILED");
      console.log("Error: ", result.error);
    }
  }
}

main().catch((err) => console.log("ERR: ", err));
