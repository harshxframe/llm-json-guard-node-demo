import { LLMJsonGuard } from "llm-json-guard";

const guard = new LLMJsonGuard();

const examples = [
  "{name: 'John', age: 25,}",
  "{name: 'Alice'}",
  "{'city': 'London', population: 9000000}",
  "{invalid json example"
];

console.log("=== MULTI EXAMPLE TESTER ===\n");

for (let i = 0; i < examples.length; i++) {
  console.log(`\n--- Example ${i + 1} ---`);
  console.log("Raw Output:");
  console.log(examples[i]);
  console.log("");

  const result = guard.sanitize(examples[i]);

  if (result.success) {
    console.log("✔ Repaired Successfully");
    console.log("Stage:", result.stage);
    console.log("Confidence:", result.meta?.confidence);
    console.log("Repaired JSON:");
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log("✖ Repair Failed Safely");
    console.log("Stage:", result.stage);
    console.log("Errors:", result.errors);
  }
}