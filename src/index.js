import "dotenv/config";
import {
  InputGuardrailTripwireTriggered,
  OutputGuardrailTripwireTriggered,
  MemorySession,
  run,
  MaxTurnsExceededError,
} from "@openai/agents";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createResearchContext } from "./context/research-context.js";
import { researchManagerAgent } from "./agents/research-manager.js";
import { handlePublishApproval } from "./approvals/publish-approval.js";
import constants from "./constants.js";
import { toolErrorFormatter } from "./config/run-config.js";

async function main() {
  const researchContext = createResearchContext({
    researchId: "research-001",
    userId: "user-123",
    company: "NVIDIA",
  });

  const session = new MemorySession({
    sessionId: "research-session-001",
  });

  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  console.log("\n======================================");
  console.log("     AI FINANCIAL RESEARCH DESK");
  console.log("======================================");

  console.log("\nAsk me anything about your research.");
  console.log("Type 'exit' to quit.\n");

  try {
    while (true) {
      try {
        const question = await rl.question("\nYou: ");
        const input = question.trim();

        if (!input) continue;

        if (question.toLowerCase() == "exit") {
          console.log("\nGoodbye!");
          break;
        }

        let result = await run(researchManagerAgent, input, {
          context: researchContext,
          session,
          maxTurns: constants.MAX_TURNS,
          toolErrorFormatter,
        });

        while (result.interruptions?.length) {
          result = await handlePublishApproval(
            result,
            rl,
            researchContext,
            session,
          );
        }

        if (typeof result?.finalOutput == "string") {
          console.log(
            "\nAssistant:\n",
            result.finalOutput.replace(/\\n/g, "\n"),
          );
        } else {
          console.log(
            "\nAssistant:\n",
            JSON.stringify(result.finalOutput, null, 2),
          );
        }
      } catch (err) {
        if (err instanceof InputGuardrailTripwireTriggered) {
          console.log(
            "\nAssistant: I can help with financial and company research, " +
              "market analysis, financial performance, and business developments.\n",
          );
          continue;
        }

        if (err instanceof OutputGuardrailTripwireTriggered) {
          console.log(
            "\nAssistant: I couldn't return that research response " +
              "because it did not pass the final safety and quality checks.\n",
          );
          continue;
        }

        if (err instanceof MaxTurnsExceededError) {
          console.log(
            "\nAssistant: The research workflow reached its execution limit.",
          );
          console.log("Please try a more focused research request.\n");
          continue;
        }

        console.log("Error while processing the request.\n", err.message);
        console.log();
      }
    }
  } finally {
    rl.close();
  }
}

main().catch((err) => console.log("ERR: ", err));
