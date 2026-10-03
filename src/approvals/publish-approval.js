// @ts-nocheck
import { run, RunToolApprovalItem } from "@openai/agents";
import { researchManagerAgent } from "../agents/research-manager.js";
import constants from "../constants.js";
import { toolErrorFormatter } from "../config/run-config.js";

export async function handlePublishApproval(
  result,
  rl,
  researchContext,
  session,
) {
  if (!result?.interruptions?.length) return result;

  const interruptions = result.interruptions ?? [];

  for (const interruption of interruptions) {
    if (!(interruption instanceof RunToolApprovalItem)) continue;

    console.log("========================================================");
    console.log("\t\tApproval Required");
    console.log("========================================================");

    console.log("Name: ", interruption.name);
    console.log("Agruments: ", interruption.arguments);
    const isApproved = await rl.question("\nDo you Approve this? (y/n): ");

    if (isApproved.trim().toLowerCase() == "y") {
      console.log("Action approved");
      result.state.approve(interruption);
    } else {
      console.log("Rejected approved");
      result.state.reject(interruption);
    }
  }

  return await run(researchManagerAgent, result.state, {
    context: researchContext,
    session,
    maxTurns: constants.MAX_TURNS,
    toolErrorFormatter,
  });
}
