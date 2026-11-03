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

test("Validation: rejects non-integer financial year", async () => {
  const result = companyFinancialsParams.safeParse({
    company: "NVIDIA",
    year: 2023.5,
  });

  assert.equal(result.success, false);
});

test("Validation: rejects missing company name", async () => {
  const result = companyFinancialsParams.safeParse({
    year: 2024,
  });

  assert.equal(result.success, false);
});

test("Validation: rejects empty company name", async () => {
  const result = companyFinancialsParams.safeParse({
    company: "",
    year: 2024,
  });

  assert.equal(result.success, false);
});

test("Validation: rejects whitespace-only company name", async () => {
  const result = companyFinancialsParams.safeParse({
    company: "    ",
    year: 2024,
  });

  assert.equal(result.success, false);
});

test("Validation: accepts valid market data arguments", () => {
  const result = companyFinancialsParams.safeParse({
    company: "Apple",
    year: 2023,
  });

  assert.equal(result.success, true);
});
