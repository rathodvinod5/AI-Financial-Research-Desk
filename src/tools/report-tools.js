import { tool } from "@openai/agents";
import { z } from "zod";
import {
  publishToolInputGuardrail,
  publishToolOutputGuadrail,
} from "../guardrails/publish-tool-guardarails.js";

export const publishResearchReport = tool({
  name: "publish_research_report",

  description: `Publish a completed financial research workspace.
    This requires human approval`,

  parameters: z.object({
    company: z.string(),
    report: z.string().describe("The completed financial research report"),
    destination: z
      .string()
      .default("research_workspace")
      .describe("Destination where the report should be published"),
  }),

  needsApproval: true,
  inputGuardrails: [publishToolInputGuardrail],
  outputGuardrails: [publishToolOutputGuadrail],

  execute: async ({ company, report, destination }, runContext) => {
    const { researchId, logger } = runContext.context;

    logger.info(`Research ${researchId}: publishing report for ${company}`);

    return {
      success: true,
      company,
      report,
      destination,
      researchId,
      message: `Research report for ${company} was published successfully.`,
      publishedAt: new Date().toISOString(),
    };
  },
});
