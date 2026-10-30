import test from "node:test";
import assert from "node:assert";
import { Runner, run } from "@openai/agents";
import {
  getCompanyFinancials,
  getMarketData,
  lookupCompanyFinancials,
  lookupMarketData,
} from "../tools/financial-tools.js";

const context = {
  researchId: "tool-unit-test",
  userId: "test_user",
  logger: {
    info() {},
  },
};

test("getCompanyFinancials returns NVIDIA FY2025 metrics", () => {
  const result = lookupCompanyFinancials("NVIDIA", 2025, "test-user");

  assert.equal(result.found, true);
  assert.equal(result.revenue, 130.5);
  assert.equal(result.revenueGrowth, 114);
});

test("getCompanyFinancials handles an unsupported year", () => {
  const result = lookupCompanyFinancials("Apple", 2024, "test-user");

  assert.equal(result.found, false);
  assert.equal(result.year, 2024);
});

test("getMarketData returns NVIDIA market metrics", () => {
  const result = lookupMarketData("NVIDIA");

  assert.equal(result.found, true);
  assert.equal(result.ticker, "NVDA");
  assert.equal(result.price, 182.41);
});

test("getMarketData handles an unknown company", () => {
  const result = lookupMarketData("UNKNOWN_CORP");

  assert.equal(result.found, false);
});

// test("getCompanyFinancials returns NVIDIA FY2025 metrics", async () => {
//   const result = await getCompanyFinancials.execute(
//     {
//       company: "NVIDIA",
//       year: 2025,
//     },
//     context,
//   );
// });
