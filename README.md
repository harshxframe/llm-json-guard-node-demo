# 🛡️ LLM JSON Guard

**Deterministic JSON repair and schema validation for unreliable LLM outputs**

Large Language Models generate probabilistic text.  
Your backend requires deterministic structure.

`llm-json-guard` repairs malformed JSON and enforces schema validation before AI output reaches production systems — fully local, with no API calls.

---

## The Problem

LLMs frequently return JSON that:

- Contains trailing commas  
- Uses single quotes instead of double quotes  
- Omits required fields  
- Breaks object structure  
- Violates expected schema contracts  

This leads to runtime failures:

```js
JSON.parse(llmOutput) // crashes production
```

Structured AI output cannot be trusted without validation.

---

## The Solution

`llm-json-guard` acts as a reliability layer between your model and your system.

It:

- Repairs malformed JSON deterministically
- Validates against JSON Schema
- Returns structured metadata
- Provides repair confidence scoring
- Fails safely with explicit error states
- Prevents silent data corruption

No external services.  
No API keys.  
No network dependency.

---

## Installation

```bash
npm install llm-json-guard
```

---

## Requirements

- Node.js 18+
- ESM environment (`"type": "module"`)

---

## Basic JSON Repair

```js
import { LLMJsonGuard } from "llm-json-guard";

const guard = new LLMJsonGuard();

const broken = "{name: 'John', age: 25,}";

const result = guard.sanitize(broken);

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

const result = guard.guard("{name: 'John'}", schema);

console.log(result);
```

If validation fails, the response will be structured:

```json
{
  "success": false,
  "stage": "validation_failed",
  "meta": {
    "repaired": true,
    "confidence": 0.92
  },
  "errors": [...]
}
```

No invalid data enters your system.

---

## Response Structure

All responses follow this structure:

```json
{
  "success": boolean,
  "stage": "parsed_only | validated | parse_failed | repair_suspicious | validation_failed",
  "meta": {
    "repaired": boolean,
    "confidence": number
  },
  "data": object,
  "errors": array
}
```

### Stage Values

- `parsed_only` — JSON repaired successfully  
- `validated` — JSON repaired and schema validated  
- `parse_failed` — JSON could not be repaired  
- `repair_suspicious` — Repair heavily modified input  
- `validation_failed` — Schema validation failed  

---

## Benchmark Example

```js
import { performance } from "node:perf_hooks";
import { LLMJsonGuard } from "llm-json-guard";

const guard = new LLMJsonGuard();

const inputs = [
  "{name: 'John', age: 25,}",
  "{name: 'Alice'}",
  "{invalid json example"
];

let totalTime = 0;

for (const input of inputs) {
  const start = performance.now();
  const result = guard.sanitize(input);
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

- AI SaaS platforms  
- LLM-powered applications  
- Backend APIs consuming model output  
- Automation pipelines  
- RAG systems  
- Agent frameworks  

---

## License

MIT

---

**LLMs are creative. Your backend should not be.**
