import { performance } from "node:perf_hooks";
import { LLMJsonGuard } from "llm-json-guard";

const guard = new LLMJsonGuard();

const testCases = [
  "{name: 'John', age: 25,}",
  "{name: 'Alice'}",
  "{'city': 'London', population: 9000000}",
  "{invalid json example",
  "{ product: 'Laptop', price: 999.99 }",
  "{ status: 'success', code: 200, }"
];

console.log("=== BENCHMARK TEST ===\n");

let successCount = 0;
let totalTime = 0;

for (let i = 0; i < testCases.length; i++) {
  const input = testCases[i];

  const start = performance.now();

  const result = guard.sanitize(input);

  const end = performance.now();

  if (result.success) {
    successCount++;
  }

  totalTime += (end - start);
}

const avgTime = (totalTime / testCases.length).toFixed(2);

console.log("Total Tests:", testCases.length);
console.log("Successful Repairs:", successCount);
console.log("Average Execution Time:", avgTime, "ms");
console.log("\nBenchmark Complete ✔");