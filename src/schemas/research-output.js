import { z } from "zod";

export const financialResearchOutput = z.object({
  dataAvailable: z.boolean(),
  company: z.string(),

  financialYear: z.number().nullable(),

  financialSummary: z
    .object({
      revenue: z.number(),
      revenueGrowth: z.number(),
      grossMargin: z.number(),
      operatingMargin: z.number(),
    })
    .nullable(),

  marketSummary: z
    .object({
      ticker: z.string(),
      price: z.number(),
      marketCap: z.number(),
      dailyChangePercent: z.number(),
    })
    .nullable(),

  dataUnavailableReason: z.string().nullable(),

  findings: z.array(z.string()),
  riskFlags: z.array(z.string()),
});
