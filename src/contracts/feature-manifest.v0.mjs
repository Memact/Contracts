import { validateObject } from "../validators.mjs"

export function validateFeatureManifest(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.feature_manifest.v0" },
    { key: "feature_id", type: "string", required: true },
    { key: "name", type: "string", required: true },
    { key: "description", type: "string", required: true },
    { key: "required_scopes", type: "array", required: true },
    { key: "required_schema_types", type: "array", required: true },
    { key: "input_contract", type: "string", required: true },
    { key: "output_contract", type: "string", required: true }
  ])
}
