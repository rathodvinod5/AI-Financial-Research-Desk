// --- Lifecycle hooks ---
export class MyRunHooks {
  async on_agent_start(context, agent, turnInput) {
    console.log("[HOOK] agent_start:", {
      agentName: agent.name,
      turnInput: turnInput ? turnInput.slice(0, 2) : null,
    });
  }

  async on_agent_end(context, agent, output) {
    console.log("[HOOK] agent_end:", {
      agentName: agent.name,
      finalOutput: output?.finalOutput ?? output,
    });
  }

  async on_agent_handoff(context, fromAgent, toAgent) {
    console.log("[HOOK] agent_handoff:", {
      from: fromAgent.name,
      to: toAgent.name,
    });
  }

  async on_agent_tool_start(context, agent, tool, info) {
    console.log("[HOOK] agent_tool_start:", {
      agentName: agent.name,
      toolName: tool.name,
      toolCall: info?.toolCall?.name,
    });
  }

  async on_agent_tool_end(context, agent, tool, result) {
    console.log("[HOOK] agent_tool_end:", {
      agentName: agent.name,
      toolName: tool.name,
      resultOk: !result.error,
    });
  }
}
