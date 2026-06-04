import { validateObject } from "../validators.mjs"

export function validateAppContextProposal(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.app_context_proposal.v0" },
    { key: "category", type: "string", required: true },
    { key: "title", type: "string", required: true },
    { key: "source_app", type: "string" },
    { key: "context", type: "object" },
    { key: "value", type: "object" },
    { key: "confidence", type: "number", min: 0, max: 1 },
    { key: "status", oneOf: ["pending", "accepted", "edited", "rejected", "deleted"] },
    { key: "visibility", oneOf: ["private", "shareable", "public"] },
    { key: "source_trail", type: "array" }
  ])
}
