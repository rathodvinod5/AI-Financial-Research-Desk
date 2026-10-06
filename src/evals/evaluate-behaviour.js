export async function evaluateBehaviour(testCase, result) {
  const runItems = result?.newItem ?? [];

  const toolNames = runItems
    .filter((tool) => tool.type == "tool_call_item")
    .map((item) => item?.rawItem?.name)
    .filter(Boolean);
  const uniqueToolNames = [new Set(...toolNames)];

  const agentNames = runItems
    .filter((item) => item?.agent?.name)
    .filter(Boolean);
  const uniqueAgentNames = [new Set(...agentNames)];

  const expectedTools = testCase?.expectedBehavior?.tools ?? [];
  const toolChecks = expectedTools.map((expectedTool) => ({
    type: "tool",
    name: expectedTool,
    passed: uniqueToolNames.includes(expectedTool),
  }));

  const expectedAgents = testCase?.expectedBehavior?.agents ?? [];
  const agentChecks = expectedAgents.map((expectedAgent) => ({
    type: "agent",
    name: expectedAgent,
    passed: uniqueAgentNames.includes(expectedAgent),
  }));

  const checks = [...toolChecks, ...agentChecks];

  return {
    passed: checks.every((check) => check.passed),
    checks,
    actualTools: uniqueToolNames,
    actualAgents: uniqueAgentNames,
  };
}
