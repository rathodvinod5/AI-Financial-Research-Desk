import {
  defineToolInputGuardrail,
  defineToolOutputGuardrail,
  ToolGuardrailFunctionOutputFactory,
} from "@openai/agents";

export const publishToolInputGuardrail = defineToolInputGuardrail({
  name: "Publish tool input guardrail",
  run: async ({ toolCall }) => {
    console.log("\n🔥 Publish tool input guardrail CALLED 🔥");
    const args = JSON.parse(toolCall?.arguments);

    const allowedDestinations = ["research-workspace"];

    if (!allowedDestinations.includes(args.destination)) {
      return ToolGuardrailFunctionOutputFactory.rejectContent(
        `Publishing to "${args.destination}" is not allowed.`,
      );
    }

    if (!args?.report?.trim()) {
      return ToolGuardrailFunctionOutputFactory.rejectContent(
        "Cannot publish an empty research report.",
      );
    }

    return ToolGuardrailFunctionOutputFactory.allow();
  },
});

export const publishToolOutputGuadrail = defineToolOutputGuardrail({
  name: "Publish tool ouput guardrail",
  run: async ({ output }) => {
    console.log("\n🔥 Publish tool output guardrail CALLED 🔥:\n");
    // @ts-ignore
    if (!output?.success) {
      return ToolGuardrailFunctionOutputFactory.rejectContent(
        "The research report was not successfully published.",
      );
    }

    return ToolGuardrailFunctionOutputFactory.allow();
  },
});
