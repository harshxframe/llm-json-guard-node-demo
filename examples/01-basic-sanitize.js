import dotenv from "dotenv";
import { LLMJsonGuard } from "llm-json-guard";

dotenv.config();

const guard = new LLMJsonGuard({
  apiKey: process.env.RAPIDAPI_KEY
});

async function run() {
  console.log("=== SANITIZE DEMO ===\n");

  const broken = "{name: 'John', age: 25,}";

  console.log("Raw LLM Output:");
  console.log(broken);
  console.log("\nProcessing...\n");

  try {
    const result = await guard.sanitize(broken);

    console.log("✔ Repair Successful\n");
    console.log("Stage:", result.stage);
    console.log("Confidence:", result.meta?.confidence);
    console.log("\nRepaired JSON:");
    console.log(JSON.stringify(result.data, null, 2));
  } catch (err) {
    console.log("✖ Repair Failed\n");
    console.log("Reason:", err.message);
  }
}

run();