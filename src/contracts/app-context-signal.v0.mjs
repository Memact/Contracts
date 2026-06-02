import { validateObject } from "../validators.mjs"

export function validateAppContextSignal(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.app_context_signal.v0" },
    { key: "event_type", type: "string", required: true },
    { key: "source_app", type: "string", required: true },
    { key: "occurred_at", type: "string", required: true },
    { key: "category", type: "string", required: true },
    { key: "payload", type: "object", required: true },
    { key: "evidence", type: "object" },
    { key: "metadata", type: "object" }
  ])
}
