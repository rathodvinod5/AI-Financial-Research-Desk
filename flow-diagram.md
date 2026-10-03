                              ┌─────────────────────┐
                              │        USER         │
                              │                     │
                              │ "Research NVIDIA    │
                              │  and publish it"    │
                              └──────────┬──────────┘
                                         │
                                         ▼
                           ┌─────────────────────────────┐
                           │      MEMORY SESSION         │
                           │                             │
                           │ Conversation history        │
                           │ maintained across turns     │
                           └──────────────┬──────────────┘
                                          │
                                          ▼
                     ╔══════════════════════════════════════════╗
                     ║       AGENT INPUT GUARDRAIL              ║
                     ║                                          ║
                     ║   Financial Research Scope Checker       ║
                     ║                                          ║
                     ║   Is this financial/company research?    ║
                     ╚════════════════════╤═════════════════════╝
                                          │
                            ┌─────────────┴─────────────┐
                            │                           │
                         ❌ INVALID                   ✅ VALID
                            │                           │
                            ▼                           ▼
                      Stop the run           ┌─────────────────────┐
                                             │  RESEARCH MANAGER   │
                                             │       AGENT         │
                                             │                     │
                                             │ Orchestrates the    │
                                             │ entire research     │
                                             └──────────┬──────────┘
                                                        │
                         ┌──────────────────────────────┼──────────────────────────────┐
                         │                              │                              │
                         │ Agents-as-Tools              │ Handoff                      │ Direct Tool
                         │                              │                              │
                         ▼                              ▼                              ▼
                ┌──────────────────┐          ┌──────────────────┐          ┌──────────────────────┐
                │ FINANCIAL        │          │ MARKET           │          │ PUBLISH RESEARCH     │
                │ ANALYST          │          │ ANALYST          │          │ REPORT               │
                │                  │          │                  │          │                      │
                │ Called as a tool │          │ Takes control    │          │ Function Tool        │
                └────────┬─────────┘          │ via handoff      │          │                      │
                         │                    └────────┬─────────┘          │ needsApproval=true   │
                         │                             │                    └──────────┬───────────┘
                         ▼                             │                               │
                ┌──────────────────┐                   │                               │
                │ Tool:            │                   │                               │
                │ get_company_     │                   │                               │
                │ financials       │                   │                               │
                └────────┬─────────┘                   │                               │
                         │                             │                               │
                         ▼                             ▼                               │
               ┌──────────────────┐           ┌──────────────────┐                     │
               │ Tool:            │           │ get_market_data  │                     │
               │ get_market_data  │           └────────┬─────────┘                     │
               └────────┬─────────┘                    │                               │
                        │                              │                               │
                        ▼                              │                               │
               Financial Analyst                       │                               │
               produces analysis                       │                               │
                        │                              │                               │
                        └──────────────┐               │                               │
                                       │               │                               │
                                       ▼               ▼                               │
                              Research Manager receives                                │
                                 specialist results                                    │
                                       │                                               │
                                       │                                               │
                                       ▼                                               │
                              ┌──────────────────┐                                     │
                              │ NEWS ANALYST     │                                     │
                              │                  │                                     │
                              │ Agents-as-Tool   │                                     │
                              └────────┬─────────┘                                     │
                                       │                                               │
                                       ▼                                               │
                              ┌──────────────────┐                                     │
                              │ get_company_news │                                     │
                              └────────┬─────────┘                                     │
                                       │                                               │
                                       ▼                                               │
                                News analysis                                          │
                                       │                                               │
                                       └─────────────────┐                             │
                                                         │                             │
                                                         ▼                             │
                                                Research Manager                       │
                                                combines findings                      │
                                                         │                             │
                                                         ▼                             │
                                           ┌─────────────────────────┐                 │
                                           │ User explicitly asks    │                 │
                                           │ to publish report?      │                 │
                                           └────────────┬────────────┘                 │
                                                        │                              │
                                                       YES                             │
                                                        │                              │
                                                        ▼                              │
                                          ┌──────────────────────────┐                 │
                                          │ TOOL INPUT GUARDRAIL     │                 │
                                          │                          │                 │
                                          │ • destination allowed?   │                 │
                                          │ • report non-empty?      │                 │
                                          └────────────┬─────────────┘                 │
                                                       │                               │
                                         ┌─────────────┴─────────────┐                 │
                                         │                           │                 │
                                      ❌ REJECT                   ✅ ALLOW              │
                                         │                           │                 │
                                         ▼                           ▼                 │
                                   Tool blocked          ┌──────────────────────┐      │
                                                         │ HUMAN APPROVAL       │      │
                                                         │                      │      │
                                                         │ "Publish report?"    │      │
                                                         └──────────┬───────────┘      │
                                                                    │                  │
                                                         ┌──────────┴──────────┐       │
                                                         │                     │       │
                                                       ❌ NO                  ✅ YES    │
                                                         │                     │       │
                                                         ▼                     ▼       │
                                                     Rejected            Tool executes |
                                                         │                     │       |
                                                         │                     ▼       │
                                                         │          ┌────────────────────┐
                                                         │          │ publish_research_  │
                                                         │          │ report             │
                                                         │          └─────────┬──────────┘
                                                         │                    │
                                                         │                    ▼
                                                         │          ┌────────────────────┐
                                                         │          │ TOOL OUTPUT        │
                                                         │          │ GUARDRAIL          │
                                                         │          │                    │
                                                         │          │ success === true?  │
                                                         │          └─────────┬──────────┘
                                                         │                    │
                                                         │             ┌──────┴──────┐
                                                         │             │             │
                                                         │           ❌ FAIL        ✅ PASS
                                                         │             │             │
                                                         │             ▼             │
                                                         │       Tool result         │
                                                         │       rejected            │
                                                         │             │             │
                                                         └─────────────┴─────────────┘
                                                                       │
                                                                       ▼
                                                        ┌─────────────────────────┐
                                                        │ RESEARCH MANAGER        │
                                                        │ produces final response │
                                                        └────────────┬────────────┘
                                                                     │
                                                                     ▼
                                             ╔══════════════════════════════════╗
                                             ║       AGENT OUTPUT GUARDRAIL     ║
                                             ║                                  ║
                                             ║ • No invented numbers?           ║
                                             ║ • No buy/sell/hold advice?       ║
                                             ║ • Facts vs analysis separated?   ║
                                             ║ • Within research scope?         ║
                                             ╚══════════════════╤═══════════════╝
                                                                │
                                                      ┌─────────┴─────────┐
                                                      │                   │
                                                   ❌ INVALID           ✅ VALID
                                                      │                   │
                                                      ▼                   ▼
                                               Block final        ┌────────────────┐
                                               response           │      USER      │
                                                                  │                │
                                                                  │ Final research │
                                                                  │    response    │
                                                                  └────────────────┘

```mermaid
┌─────────────────────────────────────────────────────────────┐
│                 AI FINANCIAL RESEARCH DESK                  │
│                                                             │
│  INPUT                                                      │
│    ↓                                                        │
│  Agent Input Guardrail                                      │
│    ↓                                                        │
│  Research Manager                                           │
│    │                                                        │
│    ├── Agents-as-Tools                                      │
│    │     ├── Financial Analyst                              │
│    │     │     ├── get_company_financials                   │
│    │     │     └── get_market_data                          │
│    │     │                                                  │
│    │     └── News Analyst                                   │
│    │           └── get_company_news                         │
│    │                                                        │
│    ├── Handoff                                              │
│    │     └── Market Analyst                                 │
│    │           └── get_market_data                          │
│    │                                                        │
│    └── publish_research_report                              │
│          │                                                  │
│          ├── Tool Input Guardrail                           │
│          ├── Human Approval                                 │
│          ├── Tool Execution                                 │
│          └── Tool Output Guardrail                          │
│                                                             │
│    ↓                                                        │
│  Agent Output Guardrail                                     │
│    ↓                                                        │
│  FINAL RESPONSE                                             │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Runtime: Context • MemorySession • maxTurns                │
│           • Error Handling • toolErrorFormatter             │
└─────────────────────────────────────────────────────────────┘
```
