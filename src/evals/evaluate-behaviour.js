export function evaluateBehavior({ testCase, result }) {
  const runItems = result?.newItems ?? [];

  // Extract tool names from the SDK's run items.
  const actualTools = runItems
    .filter((item) => item.type === "tool_call_item")
    .map((item) => item.rawItem?.name)
    .filter((name) => typeof name === "string");

  const expectedTools = testCase.expectedBehavior?.tools ?? [];

  const checks = expectedTools.map((expectedTool) => ({
    type: "tool",
    name: expectedTool,
    passed: actualTools.includes(expectedTool),
  }));

  return {
    passed: checks.every((check) => check.passed),
    checks,
    actualTools: [...new Set(actualTools)],
  };
}
