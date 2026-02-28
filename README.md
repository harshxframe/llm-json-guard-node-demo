---

# 🛡️ LLM JSON Guard

**Production-safe JSON repair and schema validation for unreliable LLM outputs.**

Large Language Models generate probabilistic text.
Your backend requires deterministic structure.

`llm-json-guard` repairs malformed JSON and enforces schema validation before AI output reaches production systems.

---

## The Problem

LLMs frequently return JSON that:

* Contains trailing commas
* Uses single quotes instead of double quotes
* Omits required fields
* Breaks object structure
* Violates expected schema contracts

This leads to runtime failures:

```js
JSON.parse(llmOutput) // crashes production
```

Structured AI output cannot be trusted without validation.

---

## The Solution

`llm-json-guard` acts as a reliability layer between your model and your system.

It:

* Repairs malformed JSON
* Validates against JSON Schema
* Returns structured metadata
* Provides repair confidence scoring
* Fails safely with explicit error states
* Prevents silent data corruption

---

## Installation

```bash
npm install llm-json-guard
```

---

## Configuration

Create a `.env` file:

```
RAPIDAPI_KEY=your_rapidapi_key_here
```

---

## Basic JSON Repair

```js
import dotenv from "dotenv";
import { LLMJsonGuard } from "llm-json-guard";

dotenv.config();

const guard = new LLMJsonGuard({
  apiKey: process.env.RAPIDAPI_KEY
});

const broken = "{name: 'John', age: 25,}";

const result = await guard.sanitize(broken);

console.log(result);
```

### Example Output

```json
{
  "success": true,
  "stage": "parsed_only",
  "meta": {
    "repaired": true,
    "confidence": 0.88
  },
  "data": {
    "name": "John",
    "age": 25
  },
  "errors": []
}
```

---

## Schema Validation

```js
const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number" }
  },
  required: ["name", "age"]
};

const result = await guard.guard("{name: 'John'}", schema);

console.log(result);
```

If validation fails:

```
Error: validation_failed
```

No invalid data enters your system.

---

## Response Structure

All successful responses follow this structure:

```json
{
  "success": boolean,
  "stage": "parsed_only | validated",
  "meta": {
    "repaired": boolean,
    "confidence": number
  },
  "data": object,
  "errors": array
}
```

### Stage Values

* `parsed_only` — JSON repaired successfully
* `validated` — JSON repaired and schema validated

---

## Benchmark Example

```js
import { performance } from "node:perf_hooks";

const inputs = [
  "{name: 'John', age: 25,}",
  "{name: 'Alice'}",
  "{invalid json example"
];

let totalTime = 0;

for (const input of inputs) {
  const start = performance.now();
  try {
    await guard.sanitize(input);
  } catch {}
  const end = performance.now();
  totalTime += (end - start);
}

console.log("Average Time:", totalTime / inputs.length, "ms");
```

---

## Production Pattern

Recommended architecture:

```
LLM → Guard → Schema Validation → Database → Business Logic
```

Instead of:

```
LLM → JSON.parse → Runtime Failure
```

---

## Use Cases

* AI SaaS platforms
* LLM-powered applications
* Backend APIs consuming model output
* Automation pipelines
* RAG systems
* Agent frameworks

---

## License

MIT

---

**LLMs are creative. Your backend should not be.**
