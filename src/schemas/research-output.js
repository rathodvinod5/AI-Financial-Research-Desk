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

// export const SuccessfulResearch = z.object({
//   dataAvailable: z.literal(true),
//   company: z.string(),
//   financialYear: z.number(),
//   financialSummary: z.object({
//     revenue: z.string(),
//     revenueGrowth: z.number(),
//     grossMargin: z.number(),
//     operatingMargin: z.number(),
//   }),
//   marketSummary: z.object({
//     ticker: z.string(),
//     price: z.number(),
//     marketCap: z.number(),
//     dailyChangePercent: z.number(),
//   }),
//   findings: z.array(z.string()),
//   riskFlag: z.array(z.string()),
// });

// export const UnavailableResearch = z.object({
//   dataAvailable: z.literal(false),
//   company: z.string(),
//   dataUnavailableReason: z.string(),
//   findings: z.array(z.string()),
//   riskFlag: z.array(z.string()),
// });

// export const financialResearchOutput = z.discriminatedUnion("dataAvailable", [
//   SuccessfulResearch,
//   UnavailableResearch,
// ]);
