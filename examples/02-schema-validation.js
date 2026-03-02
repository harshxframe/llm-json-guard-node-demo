import { LLMJsonGuard } from "llm-json-guard";

const guard = new LLMJsonGuard();

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
  const result = guard.guard(broken, schema);

  if (result.success) {
    console.log("✔ Validation Passed\n");
    console.log("Stage:", result.stage);
    console.log("Confidence:", result.meta?.confidence);
    console.log("\nValidated JSON:");
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log("✖ Validation Failed Safely\n");
    console.log("Stage:", result.stage);
    console.log("Errors:", result.errors);
    console.log("\n(This is expected when required fields are missing)");
  }

} catch (err) {
  console.log("Unexpected Error:", err.message);
}