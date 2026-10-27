import test from "node:test";
import assert from "node:assert";
import { Runner, run } from "@openai/agents";
import {
  getCompanyFinancials,
  getMarketData,
} from "../tools/financial-tools.js";

const context = {
  researchId: "tool-unit-test",
  userId: "test_user",
  logger: {
    info() {},
  },
};

test("getCompanyFinancials returns NVIDIA FY2025 metrics", async () => {
  const result = await getCompanyFinancials.execute(
    {
      company: "NVIDIA",
      year: 2025,
    },
    context,
  );
});
