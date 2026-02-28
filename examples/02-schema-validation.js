import dotenv from "dotenv";
import { LLMJsonGuard } from "llm-json-guard";

dotenv.config();

const guard = new LLMJsonGuard({
  apiKey: process.env.RAPIDAPI_KEY
});

async function run() {
  console.log("=== SCHEMA VALIDATION DEMO ===\n");

  const broken = "{name: 'John'}";

  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "number" }
    },
    required: ["name", "age"]
  };

  console.log("Raw LLM Output:");
  console.log(broken);
  console.log("\nValidating against schema...\n");

  try {
    const result = await guard.guard(broken, schema);

    console.log("✔ Validation Passed\n");
    console.log("Stage:", result.stage);
    console.log("Confidence:", result.meta?.confidence);
    console.log("\nValidated JSON:");
    console.log(JSON.stringify(result.data, null, 2));
  } catch (err) {
    console.log("✖ Validation Failed Safely\n");
    console.log("Reason:", err.message);
    console.log("\n(This is expected when required fields are missing)");
  }
}

run();