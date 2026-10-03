import constants from "../constants.js";

export function createRunConfig({ context, session }) {
  /** @type {import("@openai/agents").RunConfig} */
  return {
    context,
    session,
    maxTurns: constants.MAX_TURNS,

    // Tracing
    workflowName: "AI Financial Research Desk",
    groupId: context.researchId,
    traceMetadata: {
      researchId: context.researchId,
      company: context.company,
      userId: context.userId,
    },
    toolErrorFormatter: ({
      kind,
      toolType,
      toolName,
      callId,
      defaultMessage,
    }) => {
      //   return [
      //     `Tool "${toolName}" failed.`,
      //     `Tool type: ${toolType}`,
      //     `Error kind: ${kind}`,
      //     `Call ID: ${callId}`,
      //     `Details: ${defaultMessage}`,
      //     "Do not invent the missing data.",
      //     "Continue only if the research can be completed reliably.",
      //   ].join("\n");

      console.log("\n🔥 TOOL ERROR FORMATTER CALLED 🔥");
      console.log({
        kind,
        toolType,
        toolName,
        callId,
        defaultMessage,
      });
      return `CUSTOM TOOL ERROR: ${toolName} was rejected.`;
    },
  };
}

export const toolErrorFormatter = ({
  kind,
  toolType,
  toolName,
  callId,
  defaultMessage,
}) => {
  //   return [
  //     `Tool "${toolName}" failed.`,
  //     `Tool type: ${toolType}`,
  //     `Error kind: ${kind}`,
  //     `Call ID: ${callId}`,
  //     `Details: ${defaultMessage}`,
  //     "Do not invent the missing data.",
  //     "Continue only if the research can be completed reliably.",
  //   ].join("\n");

  console.log("\n🔥 TOOL ERROR FORMATTER CALLED 🔥");
  console.log({
    kind,
    toolType,
    toolName,
    callId,
    defaultMessage,
  });
  return `CUSTOM TOOL ERROR: ${toolName} was rejected.`;
};
