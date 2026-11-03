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

test("Regression: financial tool handles an unexpected lookup response", async () => {
  const unexpectedLookup = async () => ({
    company: "NVIDIA",
    found: true,
    // Required financial metrics are missing
  });

  const result = await executeCompanyFinancials(
    { company: "NVIDIA", year: 2025 },
    runContext,
    unexpectedLookup,
  );

  assert.equal(result.found, true);
  assert.equal(result.revenue, undefined);
});

test("Regression: market tool handles an unexpected lookup response", async () => {
  const unexpectedLookup = async () => ({
    company: "NVIDIA",
    found: true,
    // Required financial metrics are missing
  });

  const result = await executeCompanyFinancials(
    { company: "NVIDIA", year: undefined },
    runContext,
    unexpectedLookup,
  );

  assert.equal(result.found, true);
  assert.equal(result.price, undefined);
});
