import { validateObject } from "../validators.mjs"

export function validateMemorySummary(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.memory_summary.v0" },
    { key: "memory_id", type: "string", required: true },
    { key: "memory_type", type: "string", required: true },
    { key: "category", type: "string" },
    { key: "subject", type: "string", required: true },
    { key: "confidence", type: "number", min: 0, max: 1 },
    { key: "source_count", type: "number", min: 0 },
    { key: "created_at", type: "string" },
    { key: "updated_at", type: "string" }
  ])
}
