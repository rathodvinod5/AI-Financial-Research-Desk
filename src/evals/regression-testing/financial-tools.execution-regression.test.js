import test from "node:test";
import assert from "node:assert/strict";

import {
  executeCompanyFinancials,
  executeMarketData,
} from "../../tools/financial-tools.js";

const runContext = {
  context: {
    researchId: "regression-test",
    userId: "test-user",
    logger: {
      info() {},
    },
  },
};

test("Regression: financial tool propagates lookup execution errors", async () => {
  const failingLookup = async () => {
    throw new Error("Financial data source unavailable");
  };

  await assert.rejects(
    executeCompanyFinancials(
      { company: "NVIDIA", year: 2025 },
      runContext,
      failingLookup,
    ),
    {
      message: "Financial data source unavailable",
    },
  );
});

test("Regression: market tool propagates lookup execution errors", async () => {
  const failingLookup = async () => {
    throw new Error("Market data source unavailable");
  };

  await assert.rejects(
    executeMarketData({ company: "NVIDIA" }, runContext, failingLookup),
    {
      message: "Market data source unavailable",
    },
  );
});

test("Regression: rejects financial response with missing metrics", async () => {
  const unexpectedLookup = async () => ({
    company: "NVIDIA",
    year: 2025,
    found: true,
  });

  await assert.rejects(
    executeCompanyFinancials(
      { company: "NVIDIA", year: 2025 },
      runContext,
      unexpectedLookup,
    ),
    { name: "ZodError" },
  );
});

test("Regression: rejects market response with missing metrics", async () => {
  const unexpectedLookup = async () => ({
    company: "NVIDIA",
    found: true,
  });

  await assert.rejects(
    executeMarketData({ company: "NVIDIA" }, runContext, unexpectedLookup),
    { name: "ZodError" },
  );
});

test("Regression: rejects financial response with invalid metric types", async () => {
  const unexpectedLookup = async () => ({
    company: "NVIDIA",
    year: 2025,
    found: true,
    requestedBy: "test-user",
    currency: "USD billions",
    revenue: "130.5",
    revenueGrowth: 114,
    grossMargin: 75,
    operatingMargin: 61.6,
  });

  await assert.rejects(
    executeCompanyFinancials(
      { company: "NVIDIA", year: 2025 },
      runContext,
      unexpectedLookup,
    ),
    { name: "ZodError" },
  );
});

test("Regression: rejects market response with invalid metric types", async () => {
  const unexpectedLookup = async () => ({
    company: "NVIDIA",
    found: true,
    currency: "USD",
    marketCapUnit: "USD billions",
    ticker: "NVDA",
    price: "182.41",
    marketCap: 4450,
    dailyChangePercent: 1.84,
  });

  await assert.rejects(
    executeMarketData({ company: "NVIDIA" }, runContext, unexpectedLookup),
    { name: "ZodError" },
  );
});

test("Regression: accepts legitimate unavailable financial data", async () => {
  const unavailableLookup = async () => ({
    company: "UNKNOWN_CORP",
    year: 2025,
    found: false,
    message: "Financial data not available.",
  });

  const result = await executeCompanyFinancials(
    { company: "UNKNOWN_CORP", year: 2025 },
    runContext,
    unavailableLookup,
  );

  assert.equal(result.found, false);
  assert.equal(result.company, "UNKNOWN_CORP");
});

test("Regression: accepts legitimate unavailable market data", async () => {
  const unavailableLookup = async () => ({
    company: "UNKNOWN_CORP",
    found: false,
    message: "Market data is not available.",
  });

  const result = await executeMarketData(
    { company: "UNKNOWN_CORP" },
    runContext,
    unavailableLookup,
  );

  assert.equal(result.found, false);
  assert.equal(result.company, "UNKNOWN_CORP");
});
