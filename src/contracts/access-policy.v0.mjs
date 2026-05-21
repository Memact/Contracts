import { validateObject } from "../validators.mjs"

export function validateAccessPolicy(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.access_policy.v0" },
    { key: "scopes", type: "array", required: true },
    { key: "categories", type: "array", required: true },
    { key: "features", type: "array" }
  ])
}
