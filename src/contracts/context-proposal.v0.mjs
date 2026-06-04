import { validateObject } from "../validators.mjs"

export function validateContextProposal(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.context_proposal.v0" },
    { key: "input_kind", type: "string", required: true },
    { key: "category", type: "string", required: true },
    { key: "title", type: "string", required: true },
    { key: "context", type: "object", required: true },
    { key: "confidence", type: "number", required: true, min: 0, max: 1 },
    { key: "status", type: "string", required: true },
    { key: "visibility", type: "string", required: true },
    { key: "source_trail", type: "array", required: true },
    { key: "created_at", type: "string", required: true }
  ])
}
