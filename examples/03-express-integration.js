import express from "express";
import { LLMJsonGuard } from "llm-json-guard";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const guard = new LLMJsonGuard();

/* ------------------------------
   Home Page
--------------------------------*/
app.get("/", (req, res) => {
  res.send(`
    <h2>LLM JSON Guard Interactive Demo</h2>

    <form method="POST" action="/process">
      <h3>Raw LLM Output</h3>
      <textarea name="raw" rows="6" cols="70" placeholder="{name: 'John', age: 25,}"></textarea>

      <h3>Schema (Optional)</h3>
      <textarea name="schema" rows="6" cols="70" placeholder='{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" }
  },
  "required": ["name", "age"]
}'></textarea>

      <br/><br/>
      <button type="submit" name="mode" value="sanitize">Sanitize</button>
      <button type="submit" name="mode" value="guard">Guard</button>
    </form>
  `);
});

/* ------------------------------
   PROCESS ROUTE
--------------------------------*/
app.post("/process", (req, res, next) => {
  try {
    const { raw, schema, mode } = req.body;

    if (!raw) {
      return res.send(`<h3>No raw JSON provided</h3><a href="/">Back</a>`);
    }

    let result;

    if (mode === "sanitize") {
      result = guard.sanitize(raw);

    } else if (mode === "guard") {
      if (!schema) {
        return res.send(`<h3>Schema required for guard</h3><a href="/">Back</a>`);
      }

      const parsedSchema = JSON.parse(schema);
      result = guard.guard(raw, parsedSchema);

    } else {
      return res.send(`<h3>Invalid mode</h3><a href="/">Back</a>`);
    }

    res.send(`
      <h2>Result</h2>
      <pre>${JSON.stringify(result, null, 2)}</pre>
      <a href="/">Back</a>
    `);

  } catch (err) {
    next(err);
  }
});

/* ------------------------------
   404 HANDLER
--------------------------------*/
app.use((req, res) => {
  res.status(404).send(`
    <h2>404 - Route Not Found</h2>
    <a href="/">Go Home</a>
  `);
});

/* ------------------------------
   GLOBAL ERROR HANDLER
--------------------------------*/
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).send(`
    <h2 style="color:red;">Error</h2>
    <p>${err.message}</p>
    <a href="/">Back</a>
  `);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});