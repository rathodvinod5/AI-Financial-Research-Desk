import "dotenv/config";
import {
  Agent,
  InputGuardrailTripwireTriggered,
  MemorySession,
  run,
  Runner,
} from "@openai/agents";
import { z } from "zod";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import {
  getCompanyFinancials,
  getMarketData,
} from "./tools/financial-tools.js";
import { createResearchContext } from "./context/research-context.js";
import { financialReserachOutput } from "./schemas/research-output.js";
import { financialAnalystAgent } from "./agents/financial-analyst.js";
import { researchManagerAgent } from "./agents/research-manager.js";
import { MyRunHooks } from "./hooks/agent-listeners.js";

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

        const result = await run(researchManagerAgent, input, {
          context: researchContext,
          session,
        });

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
              "market analysis, financial performance, and business developments.",
          );

          console.log();
          continue;
        }

        console.log("Error while processing the request.\n", err);
        console.log();
      }
    }
  } finally {
    rl.close();
  }
}

main().catch((err) => console.log("ERR: ", err));
