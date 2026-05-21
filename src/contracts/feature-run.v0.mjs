import { validateObject } from "../validators.mjs"

export function validateFeatureRunRequest(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.feature_run_request.v0" },
    { key: "feature_id", type: "string", required: true },
    { key: "app_id", type: "string", required: true },
    { key: "input", type: "object", required: true },
    { key: "requested_at", type: "string", required: true }
  ])
}

export function validateFeatureRunResult(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.feature_run_result.v0" },
    { key: "feature_id", type: "string", required: true },
    { key: "status", required: true, oneOf: ["ok", "error"] },
    { key: "output", type: "object", required: true },
    { key: "errors", type: "array", required: true },
    { key: "generated_at", type: "string", required: true }
  ])
}
