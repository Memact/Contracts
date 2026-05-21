import { validateObject } from "../validators.mjs"

export function validateApiError(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.api_error.v0" },
    { key: "code", type: "string", required: true },
    { key: "message", type: "string", required: true },
    { key: "details", type: "object" }
  ])
}
