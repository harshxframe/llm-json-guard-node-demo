import { LLMJsonGuard } from "llm-json-guard";

const guard = new LLMJsonGuard();

console.log("=== SANITIZE DEMO ===\n");

const broken = "{name: 'John', age: 25,}";

console.log("Raw LLM Output:");
console.log(broken);
console.log("\nProcessing...\n");

try {
  const result = guard.sanitize(broken);

  console.log("✔ Repair Successful\n");
  console.log("Stage:", result.stage);
  console.log("Confidence:", result.meta?.confidence);
  console.log("\nRepaired JSON:");
  console.log(JSON.stringify(result.data, null, 2));
} catch (err) {
  console.log("✖ Repair Failed\n");
  console.log("Reason:", err.message);
}