import dotenv from "dotenv";
import { LLMJsonGuard } from "llm-json-guard";

dotenv.config();

const guard = new LLMJsonGuard({
  apiKey: process.env.RAPIDAPI_KEY
});

const examples = [
  "{name: 'John', age: 25,}",
  "{name: 'Alice'}",
  "{'city': 'London', population: 9000000}",
  "{invalid json example"
];

async function run() {
  console.log("=== MULTI EXAMPLE TESTER ===\n");

  for (let i = 0; i < examples.length; i++) {
    console.log(`\n--- Example ${i + 1} ---`);
    console.log("Raw Output:");
    console.log(examples[i]);
    console.log("");

    try {
      const result = await guard.sanitize(examples[i]);

      console.log("✔ Repaired Successfully");
      console.log("Confidence:", result.meta?.confidence);
      console.log("Repaired JSON:");
      console.log(JSON.stringify(result.data, null, 2));
    } catch (err) {
      console.log("✖ Repair Failed");
      console.log("Reason:", err.message);
    }
  }
}

run();