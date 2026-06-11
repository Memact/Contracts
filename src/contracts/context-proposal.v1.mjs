import { validateObject } from "../validators.mjs"

export function validateContextProposalV1(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.context_proposal.v1" },
    { key: "proposal_id", type: "string", required: true },
    { key: "app_id", type: "string", required: true },
    { key: "connection_id", type: "string", required: true },
    { key: "user_id", type: "string" },
    { key: "source_type", oneOf: ["app", "memact", "user", "import", "system"], required: true },
    { key: "category", type: "string", required: true },
    { key: "field_path", type: "string", required: true },
    { key: "proposed_value", required: true },
    { key: "evidence_summary", type: "string" },
    { key: "confidence", type: "number", required: true, min: 0, max: 1 },
    { key: "status", oneOf: ["pending", "approved", "rejected", "edited"], required: true },
    { key: "sensitivity", type: "string", required: true },
    { key: "visibility", oneOf: ["private", "shareable", "public"], required: true },
    { key: "created_at", type: "string", required: true },
    { key: "updated_at", type: "string" }
  ])
}
