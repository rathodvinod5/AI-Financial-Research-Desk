//              ┌────────────────────┐
//              │  Research Manager  │
//              └─────────┬──────────┘
//                        │
//         ┌──────────────┼──────────────┐
//         │              │              │
//         ▼              ▼              ▼
//   Financial         Market          News
//    Agent            Agent          Agent
//         │              │              │
//         └──────────────┼──────────────┘
//                        ▼
//                 ┌──────────────┐
//                 │ Risk Analyst │
//                 └──────┬───────┘
//                        │
//                        ▼
//                ┌──────────────┐
//                │ Fact Checker │
//                └──────┬───────┘
//                       │
//               ┌───────┴────────┐
//               │                │
//          verified          rejected
//               │                │
//               │          retry research
//               │                │
//               └───────┬────────┘
//                       ▼
//                Report Writer
//                       │
//                       ▼
//                     Final

// Overall flow

//                     AI FINANCIAL RESEARCH DESK
//                               │
//                               │
//                     ┌─────────▼─────────┐
//                     │       Agent       │
//                     │   Architecture    │
//                     └─────────┬─────────┘
//                               │
//        ┌──────────────────────┼────────────────────────┐
//        │                      │                        │
//        ▼                      ▼                        ▼
//    Context                 Sessions                Tools
//        │                      │                        │
//        │                      │                 ┌──────┴──────┐
//        │                      │                 │             │
//        │                      │            Function tools   APIs
//        │                      │
//        └──────────────┬───────┘
//                       │
//                       ▼
//                Multi-Agent
//                 Orchestration
//                       │
//               ┌───────┴────────┐
//               │                │
//               ▼                ▼
//           Handoffs        Agents-as-tools
//               │                │
//               └───────┬────────┘
//                       ▼
//                   Guardrails
//                       │
//           ┌───────────┼────────────┐
//           ▼           ▼            ▼
//         Input       Output        Tool
//                       │
//                       ▼
//               Structured Outputs
//                       │
//                       ▼
//               Human Approval
//                       │
//                       ▼
//                   Agent Loop
//                       │
//                       ▼
//                    Runner
//                       │
//                       ▼
//                   Tracing
//                       │
//                       ▼
//                  Evaluation

// Path for project dev
// RunContext → structured outputs → specialist agents → agents-as-tools → handoffs → sessions → guardrails → approvals → tracing → evaluation
