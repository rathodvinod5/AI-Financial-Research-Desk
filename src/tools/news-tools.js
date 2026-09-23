import { tool } from "@openai/agents";
import { z } from "zod";

export const getCompanyNews = tool({
  name: "get_company_news",
  description:
    "Get the latest news and business development related to apublic company.",
  parameters: z.object({
    company: z
      .string()
      .describe("The name of the company example: NVIDIA, Apple etc"),
  }),
  execute: async ({ company }, runContext) => {
    const { researchId, logger } = runContext.context;

    logger.info(`Research ${researchId}: fetching news for ${company}`);

    const newsData = {
      NVIDIA: [
        {
          headline:
            "NVIDIA reports strong demand for accelerated computing products",
          category: "Business",
          summary:
            "Strong demand for AI infrastructure continues to drive interest in NVIDIA's products.",
        },
        {
          headline: "NVIDIA faces increasing competition in AI accelerators",
          category: "Competition",
          summary:
            "Competing semiconductor companies and custom silicon programs may increase competitive pressure.",
        },
        {
          headline:
            "Export restrictions remain a consideration for semiconductor companies",
          category: "Geopolitics",
          summary:
            "Changes in export regulations may affect access to certain international markets.",
        },
      ],

      Apple: [
        {
          headline: "Apple continues expansion of its services business",
          category: "Business",
          summary:
            "Services remain an important component of Apple's overall business.",
        },
        {
          headline:
            "Apple continues investment in its hardware and software ecosystem",
          category: "Product",
          summary:
            "The company continues developing products and services across its ecosystem.",
        },
      ],
    };

    if (!newsData[company]) {
      return {
        company,
        found: false,
        articles: [],
        message: "Company news not found",
      };
    }

    return {
      company,
      found: true,
      articles: newsData[company],
    };
  },
});
