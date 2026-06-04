import { validateObject } from "../validators.mjs"

export function validateWikiEntry(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.wiki_entry.v0" },
    { key: "entry_id", type: "string", required: true },
    { key: "user_id", type: "string" },
    { key: "title", type: "string", required: true },
    { key: "category", type: "string", required: true },
    { key: "value", type: "object", required: true },
    { key: "source_type", oneOf: ["user", "app", "memact", "memact_feature"] },
    { key: "confidence", type: "number", min: 0, max: 1 },
    { key: "user_verified", type: "boolean" },
    { key: "visibility", oneOf: ["private", "shareable", "public"] },
    { key: "status", oneOf: ["draft", "pending", "accepted", "edited", "rejected", "expired", "deleted", "contradicted", "resolved"] },
    { key: "created_at", type: "string" },
    { key: "updated_at", type: "string" }
  ])
}
