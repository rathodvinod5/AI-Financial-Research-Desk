import "dotenv/config";
import { Agent, run, Runner } from "@openai/agents";
import { z } from "zod";

const researchAgent = new Agent({
  name: "Financial Research Agent",
  instructions: ``,
});
