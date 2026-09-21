import { tool } from "@openai/agents";
import { z } from "zod";

export const getCompanyFinancials = tool({
  name: "get_company_financials",
  description: `Get key financial metrics for public company for a specific year`,
  parameters: z.object({
    company: z
      .string()
      .describe("Name of the company example NVIDIA, Apple etc"),
    year: z
      .number()
      .int()
      .min(2020)
      .max(2026)
      .describe("The financial year to retrieve"),
  }),
  strict: true,
  execute: async ({ company, year }) => {
    const financialData = {
      NVIDIA: {
        2025: {
          revenue: 130.5,
          revenueGrowth: 114,
          grossMargin: 75.0,
          operatingMargin: 61.6,
        },
      },

      Apple: {
        2025: {
          revenue: 416.2,
          revenueGrowth: 6,
          grossMargin: 46.9,
          operatingMargin: 31.0,
        },
      },
    };

    const companyData = financialData?.[company];
    const companyYearData = companyData?.[year];

    if (!companyData) {
      return {
        company,
        year,
        found: false,
        message: "Financial data not available!.",
      };
    }

    return {
      company,
      year,
      found: true,
      currency: "USD billions",
      ...companyYearData,
    };
  },
});
