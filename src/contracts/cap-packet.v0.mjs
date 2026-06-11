import { fail, ok, validateObject } from "../validators.mjs"

const SCHEMA_VERSION = "memact.cap_packet.v0"
const REQUIRED_FORBIDDEN_CONTEXT = ["full_profile", "raw_capture_events", "unapproved_memory"]
const BLOCKED_FIELD_PATTERNS = [/full[_-]?profile/i, /^profile$/i, /raw[_-]?capture/i, /raw[_-]?event/i]

export function validateCapPacket(input) {
  const base = validateObject(input, [
    { key: "schema_version", required: true, type: "string", const: SCHEMA_VERSION },
    { key: "packet_id", required: true, type: "string" },
    { key: "request_id", required: true, type: "string" },
    { key: "app_id", required: true, type: "string" },
    { key: "connection_id", required: true, type: "string" },
    { key: "purpose", required: true, type: "string" },
    { key: "allowed_context", required: true, type: "array" },
    { key: "missing_context", required: true, type: "array" },
    { key: "forbidden_context", required: true, type: "array" },
    { key: "retention", required: true, type: "string", oneOf: ["none"] },
    { key: "requires_user_review", required: true, type: "boolean" },
    { key: "created_at", required: true, type: "string" }
  ])
  if (!input || typeof input !== "object" || Array.isArray(input)) return base

  const errors = base.ok ? [] : [...base.errors]
  validateAllowedContext(input.allowed_context, errors)
  validateMissingContext(input.missing_context, errors)
  validateForbiddenContext(input.forbidden_context, errors)
  if (Number.isNaN(Date.parse(input.created_at))) {
    errors.push({ path: "created_at", message: "Expected ISO date string." })
  }
  return errors.length ? fail(errors) : ok(input)
}

function validateAllowedContext(items, errors) {
  if (!Array.isArray(items)) return
  items.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push({ path: `allowed_context.${index}`, message: "Expected object." })
      return
    }
    for (const key of ["field_path", "value", "category", "sensitivity", "source"]) {
      if (item[key] === undefined || item[key] === null || item[key] === "") {
        errors.push({ path: `allowed_context.${index}.${key}`, message: "Required field is missing." })
      }
    }
    const fieldPath = String(item.field_path || "")
    const source = String(item.source || "")
    if (BLOCKED_FIELD_PATTERNS.some((pattern) => pattern.test(fieldPath) || pattern.test(source))) {
      errors.push({ path: `allowed_context.${index}.field_path`, message: "CAP packets must not include full profiles or raw capture events." })
    }
    if (item.value && typeof item.value === "object" && !Array.isArray(item.value)) {
      const keys = Object.keys(item.value)
      if (keys.some((key) => /full[_-]?profile|raw[_-]?capture|raw[_-]?events?/i.test(key))) {
        errors.push({ path: `allowed_context.${index}.value`, message: "CAP packet value contains forbidden profile or raw-event data." })
      }
    }
    if (item.confidence !== undefined && (typeof item.confidence !== "number" || item.confidence < 0 || item.confidence > 1)) {
      errors.push({ path: `allowed_context.${index}.confidence`, message: "Must be a number from 0 to 1." })
    }
  })
}

function validateMissingContext(items, errors) {
  if (!Array.isArray(items)) return
  items.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push({ path: `missing_context.${index}`, message: "Expected object." })
      return
    }
    if (!item.description || typeof item.description !== "string") {
      errors.push({ path: `missing_context.${index}.description`, message: "Required field is missing." })
    }
  })
}

function validateForbiddenContext(items, errors) {
  if (!Array.isArray(items)) return
  items.forEach((item, index) => {
    if (typeof item !== "string" || !item.trim()) {
      errors.push({ path: `forbidden_context.${index}`, message: "Expected non-empty string." })
    }
  })
  for (const required of REQUIRED_FORBIDDEN_CONTEXT) {
    if (!items.includes(required)) {
      errors.push({ path: "forbidden_context", message: `Must include ${required}.` })
    }
  }
}
