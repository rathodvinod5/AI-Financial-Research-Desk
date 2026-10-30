import { tool } from "@openai/agents";
import { z } from "zod";

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
  parameters: z.object({
    company: z.string().describe("Company name, for example NVIDIA or Apple"),
    year: z.number().int().min(2020).max(2026),
  }),
  execute: async ({ company, year }, runContext) => {
    const { researchId, userId, logger } = runContext.context;

    logger.info(
      `Research ${researchId}: fetching financial data for ${company}`,
    );

    return lookupCompanyFinancials(company, year, userId);
  },
});

export const getMarketData = tool({
  name: "get_market_data",
  description: "Get market information for a public company.",
  parameters: z.object({
    company: z.string().describe("Company name, for example NVIDIA or Apple"),
  }),
  execute: async ({ company }, runContext) => {
    const { researchId, logger } = runContext.context;

    logger.info(`Research ${researchId}: fetching market data for ${company}`);

    return lookupMarketData(company);
  },
});

// export const getCompanyFinancials = tool({
//   name: "get_company_financials",
//   description: `Get key financial metrics for public company for a specific year`,
//   parameters: z.object({
//     company: z
//       .string()
//       .describe("Name of the company example NVIDIA, Apple etc"),
//     year: z
//       .number()
//       .int()
//       .min(2020)
//       .max(2026)
//       .describe("The financial year to retrieve"),
//   }),
//   execute: async ({ company, year }, runContext) => {
//     const { researchId, userId, logger } = runContext.context;

//     logger.info(
//       `Research ${researchId}: fetching financial data for ${company}`,
//     );

//     const financialData = {
//       NVIDIA: {
//         2025: {
//           revenue: 130.5,
//           revenueGrowth: 114,
//           grossMargin: 75.0,
//           operatingMargin: 61.6,
//         },
//       },

//       Apple: {
//         2025: {
//           revenue: 416.2,
//           revenueGrowth: 6,
//           grossMargin: 46.9,
//           operatingMargin: 31.0,
//         },
//       },
//     };

//     const companyData = financialData?.[company];
//     const companyYearData = companyData?.[year];

//     if (!companyData) {
//       return {
//         company,
//         year,
//         found: false,
//         message: "Financial data not available!.",
//       };
//     }

//     if (!companyYearData) {
//       return {
//         company,
//         year,
//         found: false,
//         message:
//           "Financial data not available for the requested company and year.",
//       };
//     }

//     return {
//       company,
//       year,
//       found: true,
//       requestedBy: userId,
//       currency: "USD billions",
//       ...companyYearData,
//     };
//   },
// });

// export const getMarketData = tool({
//   name: "get_market_data",
//   description: `Get current market information such as stock price, market capaitalization
//   and daily price change for public company.`,
//   parameters: z.object({
//     company: z
//       .string()
//       .describe("The company name, for example NVIDIA or Apple"),
//   }),
//   execute: async ({ company }, runContext) => {
//     const { researchId, userId, logger } = runContext.context;

//     logger.info(`Research ${researchId}: fetching market data for ${company}`);

//     const marketData = {
//       NVIDIA: {
//         ticker: "NVDA",
//         price: 182.41,
//         marketCap: 4450,
//         dailyChangePercent: 1.84,
//       },
//       Apple: {
//         ticker: "AAPL",
//         price: 251.32,
//         marketCap: 3720,
//         dailyChangePercent: -0.42,
//       },
//     };

//     if (!marketData[company]) {
//       return {
//         company,
//         found: false,
//         message: "Market data is not available.",
//       };
//     }

//     return {
//       company,
//       found: true,
//       currency: "USD",
//       marketCapUnit: "USD billions",
//       ...marketData[company],
//     };
//   },
// });
