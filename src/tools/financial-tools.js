import { tool } from "@openai/agents";
import { z } from "zod";

export const companyFinancialsParams = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .describe("Company name, for example NVIDIA or Apple"),
  year: z.number().int().min(2020).max(2026),
});

export const marketDataParams = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .describe("Company name, for example NVIDIA or Apple"),
});

export const companyFinancialsOutput = z.discriminatedUnion("found", [
  z.object({
    company: z.string(),
    year: z.number(),
    found: z.literal(false),
    message: z.string(),
  }),
  z.object({
    company: z.string(),
    year: z.number(),
    found: z.literal(true),
    requestedBy: z.string(),
    currency: z.string(),
    revenue: z.number(),
    revenueGrowth: z.number(),
    grossMargin: z.number(),
    operatingMargin: z.number(),
  }),
]);

export const marketDataOutput = z.discriminatedUnion("found", [
  z.object({
    company: z.string(),
    found: z.literal(false),
    message: z.string(),
  }),
  z.object({
    company: z.string(),
    found: z.literal(true),
    currency: z.string(),
    marketCapUnit: z.string(),
    ticker: z.string(),
    price: z.number(),
    marketCap: z.number(),
    dailyChangePercent: z.number(),
  }),
]);

export async function executeCompanyFinancials(
  { company, year },
  runContext,
  lookup = lookupCompanyFinancials,
) {
  const { researchId, userId, logger } = runContext.context;

  logger.info(`Research ${researchId}: fetching financial data for ${company}`);

  const result = await lookup(company, year, userId);
  return companyFinancialsOutput.parse(result);
}

export async function executeMarketData(
  { company },
  runContext,
  lookup = lookupMarketData,
) {
  const { researchId, logger } = runContext.context;

  logger.info(`Research ${researchId}: fetching market data for ${company}`);

  const result = await lookup(company);
  return marketDataOutput.parse(result);
}

export function lookupCompanyFinancials(company, year, userId) {
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

  const companyYearData = financialData[company]?.[year];

  if (!companyYearData) {
    return {
      company,
      year,
      found: false,
      message:
        "Financial data not available for the requested company and year.",
    };
  }

  return {
    company,
    year,
    found: true,
    requestedBy: userId,
    currency: "USD billions",
    ...companyYearData,
  };
}

export function lookupMarketData(company) {
  const marketData = {
    NVIDIA: {
      ticker: "NVDA",
      price: 182.41,
      marketCap: 4450,
      dailyChangePercent: 1.84,
    },
    Apple: {
      ticker: "AAPL",
      price: 251.32,
      marketCap: 3720,
      dailyChangePercent: -0.42,
    },
  };

  const companyData = marketData[company];

  if (!companyData) {
    return {
      company,
      found: false,
      message: "Market data is not available.",
    };
  }

  return {
    company,
    found: true,
    currency: "USD",
    marketCapUnit: "USD billions",
    ...companyData,
  };
}

export const getCompanyFinancials = tool({
  name: "get_company_financials",
  description:
    "Get key financial metrics for a public company for a specific year.",
  // parameters: z.object({
  //   company: z.string().describe("Company name, for example NVIDIA or Apple"),
  //   year: z.number().int().min(2020).max(2026),
  // }),
  parameters: companyFinancialsParams,
  execute: async ({ company, year }, runContext) => {
    return executeCompanyFinancials({ company, year }, runContext);
    // const { researchId, userId, logger } = runContext.context;

    // logger.info(
    //   `Research ${researchId}: fetching financial data for ${company}`,
    // );

    // return lookupCompanyFinancials(company, year, userId);
  },
});

export const getMarketData = tool({
  name: "get_market_data",
  description: "Get market information for a public company.",
  // parameters: z.object({
  //   company: z.string().describe("Company name, for example NVIDIA or Apple"),
  // }),
  parameters: marketDataParams,
  execute: async ({ company }, runContext) => {
    return executeMarketData({ company }, runContext);
    // const { researchId, logger } = runContext.context;

    // logger.info(`Research ${researchId}: fetching market data for ${company}`);

    // return lookupMarketData(company);
  },
});
