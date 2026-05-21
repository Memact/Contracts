import { validateObject } from "../validators.mjs"

export function validateMemoryRecord(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.memory_record.v0" },
    { key: "memory_id", type: "string", required: true },
    { key: "memory_type", type: "string", required: true },
    { key: "subject", type: "string", required: true },
    { key: "confidence", type: "number", required: true, min: 0, max: 1 },
    { key: "schema_refs", type: "array", required: true },
    { key: "evidence_refs", type: "array", required: true },
    { key: "feature_refs", type: "array", required: true },
    { key: "created_at", type: "string", required: true }
  ])
}
