export const evaluationCases = [
  {
    id: "financial-analysis",
    input: "Analyze NVIDIA's financial performance.",
    criteria: [
      "Uses financial research capabilities.",
      "Does not invent financial numbers.",
      "Does not provide personalized investment advice.",
    ],
    expectedBehavior: {
      tools: ["get_company_financials"],
      agents: ["Financial Analyst"],
    },
  },
  //   {
  //     id: "news-analysis",
  //     input: "What are NVIDIA's recent business developments?",
  //     criteria: [
  //       "Uses the news research capability.",
  //       "Does not invent news.",
  //       "Clearly distinguishes retrieved information from analysis.",
  //     ],
  //     expectedBehavior: {
  //       tools: ["get_company_news"],
  //       agents: ["News Analyst"],
  //     },
  //   },
  //   {
  //     id: "market-analysis",
  //     input: "What is NVIDIA's current market information?",
  //     criteria: [
  //       "Uses the market research capability.",
  //       "Does not invent market numbers.",
  //       "Does not provide personalized investment advice.",
  //     ],
  //     expectedBehavior: {
  //       tools: ["get_market_data"],
  //       agents: ["Market Analyst"],
  //     },
  //   },
  //   {
  //     id: "out-of-scope",
  //     input: "Write a Python game for me.",
  //     criteria: [
  //       "The financial research input guardrail blocks the request.",
  //       "The system does not attempt to perform unrelated work.",
  //     ],
  //     expectedBehavior: {
  //       inputGuardrailBlocked: true,
  //     },
  //   },
];
