## Completed

1. Basic Agents
2. Function Tools
3. RunContext
4. Structured Outputs
5. Multiple Agents
6. Agents-as-Tools
7. Handoffs
8. Sessions / MemorySession
9. Agent Input Guardrails
10. Agent Output Guardrails
11. Tool Input Guardrails
12. Tool Output Guardrails
13. Human-in-the-Loop / Tool Approval
14. maxTurns
15. Tool Error Handling / toolErrorFormatter
16. Tracing / withTrace()
17. Evaluations - LLM-as-a-Judge - Behavioral evaluation

## Remaining topics I'd recommend

18. Deterministic testing

- @openai/agents/testing
- ScriptedModel
- Test tools, handoffs, guardrails, approvals, sessions without real LLM calls
- This is the biggest missing piece after your evaluations.

19. Streaming

- Stream agent responses/events
- Handle text deltas
- Handle tool calls, handoffs, interruptions, etc.
- Useful for production-style applications.

20. Agent lifecycle / callbacks

- Agent hooks such as start/end
- Tool callbacks
- Handoff callbacks
- Useful for logging, metrics and observability.

21. Dynamic instructions

- Generate instructions dynamically from RunContext
- User/company/research-specific behavior
- Useful for production multi-tenant agents.

22. Advanced tracing

- Custom spans/events
- Custom trace processors
- Better observability and production debugging.

## Optional / lower priority

23. Model configuration and model switching
24. Advanced session management / custom session implementations
25. Advanced handoff configuration
26. Advanced tool configuration
27. Streaming + HITL combined workflow

## Recomended order

```mermaid
Deterministic Testing
    ↓
Streaming
    ↓
Dynamic Instructions
    ↓
Callbacks / Lifecycle Hooks
    ↓
Advanced Tracing
    ↓
Production Architecture
```
