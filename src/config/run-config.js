import constants from "../constants.js";

export async function createRunConfig({ context, session }) {
  return {
    context,
    session,
    maxTurns: constants.MAX_TURNS,
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
