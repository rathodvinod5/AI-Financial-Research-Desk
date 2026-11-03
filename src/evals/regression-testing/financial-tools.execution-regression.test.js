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
