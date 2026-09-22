import { z } from "zod";

export const financialReserachOutput = z.object({
  company: z.string(),
  financialYear: z.number(),
  financialSummary: z.object({
    revenue: z.string(),
    revenueGrowth: z.number(),
    grossMargin: z.number(),
    operatingMargin: z.number(),
  }),
  marketSummary: z.object({
    ticker: z.string(),
    price: z.number(),
    marketCap: z.number(),
    dailyChangePercent: z.number(),
  }),
  findings: z.array(z.string()),
  riskFlag: z.array(z.string()),
});
