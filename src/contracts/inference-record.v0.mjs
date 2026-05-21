import { validateObject } from "../validators.mjs"

export function validateInferenceRecord(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.inference_record.v0" },
    { key: "record_id", type: "string", required: true },
    { key: "meaningful", type: "boolean", required: true },
    { key: "meaningful_score", type: "number", required: true, min: 0, max: 1 },
    { key: "canonical_themes", type: "array", required: true },
    { key: "candidate_nodes", type: "array", required: true },
    { key: "candidate_edges", type: "array", required: true },
    { key: "sources", type: "array", required: true },
    { key: "created_at", type: "string", required: true }
  ])
}
