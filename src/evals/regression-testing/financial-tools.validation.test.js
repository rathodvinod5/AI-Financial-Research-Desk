import assert from "node:assert";
import test from "node:test";
import { companyFinancialsParams } from "../../tools/financial-tools.js";

test("Validation: accepts valid financial tool arguments", async () => {
  const result = companyFinancialsParams.safeParse({
    company: "NVIDIA",
    year: 2025,
  });

  assert.equal(result.success, true);
});

test("Validation: rejects financial year below 2020", async () => {
  const result = companyFinancialsParams.safeParse({
    company: "NVIDIA",
    year: 2019,
  });

  assert.equal(result.success, false);
});

test("Validation: rejects financial year above 2026", async () => {
  const result = companyFinancialsParams.safeParse({
    company: "NVIDIA",
    year: 2030,
  });

  assert.equal(result.success, false);
});
