import { validateObject } from "../validators.mjs"

export function validateCaptureEvent(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.capture_event.v0" },
    { key: "event_type", type: "string", required: true },
    { key: "source_app", type: "string", required: true },
    { key: "occurred_at", type: "string", required: true },
    { key: "category", type: "string", required: true },
    { key: "payload", type: "object", required: true },
    { key: "permission_context", type: "object" },
    { key: "evidence", type: "object" },
    { key: "metadata", type: "object" }
  ])
}
