import { validateObject } from "../validators.mjs"

export function validateSdkResponse(value) {
  return validateObject(value, [
    { key: "ok", type: "boolean", required: true },
    { key: "data", type: "object" },
    { key: "error", type: "object" }
  ])
}
