import { fail, ok, validateObject } from "../validators.mjs"

const SCHEMA_VERSION = "memact.cap_request.v0"

export function validateCapRequest(input) {
  const base = validateObject(input, [
    { key: "schema_version", required: true, type: "string", const: SCHEMA_VERSION },
    { key: "request_id", required: true, type: "string" },
    { key: "app_id", required: true, type: "string" },
    { key: "connection_id", type: "string" },
    { key: "purpose", required: true, type: "string" },
    { key: "requested_context", required: true, type: "array" },
    { key: "requested_categories", type: "array" },
    { key: "requested_scopes", type: "array" },
    { key: "created_at", required: true, type: "string" }
  ])
  if (!input || typeof input !== "object" || Array.isArray(input)) return base

  const errors = base.ok ? [] : [...base.errors]
  if (!Array.isArray(input.requested_context) || !input.requested_context.length) {
    errors.push({ path: "requested_context", message: "At least one requested context item is required." })
  } else {
    input.requested_context.forEach((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        errors.push({ path: `requested_context.${index}`, message: "Expected object." })
        return
      }
      if (!item.description || typeof item.description !== "string") {
        errors.push({ path: `requested_context.${index}.description`, message: "Required field is missing." })
      }
      if (item.field_hint !== undefined && typeof item.field_hint !== "string") {
        errors.push({ path: `requested_context.${index}.field_hint`, message: "Expected string." })
      }
      if (item.category_hint !== undefined && typeof item.category_hint !== "string") {
        errors.push({ path: `requested_context.${index}.category_hint`, message: "Expected string." })
      }
      if (typeof item.required !== "boolean") {
        errors.push({ path: `requested_context.${index}.required`, message: "Expected boolean." })
      }
    })
  }
  for (const key of ["requested_categories", "requested_scopes"]) {
    if (input[key] !== undefined && !input[key].every((item) => typeof item === "string" && item.trim())) {
      errors.push({ path: key, message: "Expected an array of non-empty strings." })
    }
  }
  if (Number.isNaN(Date.parse(input.created_at))) {
    errors.push({ path: "created_at", message: "Expected ISO date string." })
  }
  return errors.length ? fail(errors) : ok(input)
}
