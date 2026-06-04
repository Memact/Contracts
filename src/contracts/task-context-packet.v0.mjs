import { fail, ok, validateObject } from "../validators.mjs"

const SCHEMA_VERSION = "memact.task_context_packet.v0"
const ACTOR_TYPES = ["memact_worker"]
const PURPOSES = ["onboarding_prefill", "field_mapping", "context_conversion"]
const RETENTION_VALUES = ["none"]
const REQUIRED_FORBIDDEN_CONTEXT = ["full_profile", "raw_capture_events", "unapproved_memory"]

export function validateTaskContextPacket(input) {
  const base = validateObject(input, [
    { key: "schema_version", required: true, type: "string", const: SCHEMA_VERSION },
    { key: "packet_id", required: true, type: "string" },
    { key: "actor", required: true, type: "object" },
    { key: "purpose", required: true, type: "string", oneOf: PURPOSES },
    { key: "target_app_id", required: true, type: "string" },
    { key: "connection_id", required: true, type: "string" },
    { key: "allowed_context", required: true, type: "array" },
    { key: "forbidden_context", required: true, type: "array" },
    { key: "retention", required: true, type: "string", oneOf: RETENTION_VALUES },
    { key: "requires_user_review", required: true, type: "boolean" },
    { key: "created_at", required: true, type: "string" }
  ])
  if (!input || typeof input !== "object" || Array.isArray(input)) return base

  const errors = base.ok ? [] : [...base.errors]
  if (!ACTOR_TYPES.includes(input.actor.type)) {
    errors.push({ path: "actor.type", message: `Must be one of: ${ACTOR_TYPES.join(", ")}.` })
  }
  if (!input.actor.id || typeof input.actor.id !== "string") {
    errors.push({ path: "actor.id", message: "Required field is missing." })
  }

  input.allowed_context.forEach((fragment, index) => {
    if (!fragment || typeof fragment !== "object" || Array.isArray(fragment)) {
      errors.push({ path: `allowed_context.${index}`, message: "Expected object." })
      return
    }
    for (const key of ["field_path", "value", "category", "sensitivity", "source"]) {
      if (fragment[key] === undefined || fragment[key] === null || fragment[key] === "") {
        errors.push({ path: `allowed_context.${index}.${key}`, message: "Required field is missing." })
      }
    }
  })

  input.forbidden_context.forEach((item, index) => {
    if (typeof item !== "string" || !item.trim()) {
      errors.push({ path: `forbidden_context.${index}`, message: "Expected non-empty string." })
    }
  })
  for (const required of REQUIRED_FORBIDDEN_CONTEXT) {
    if (!input.forbidden_context.includes(required)) {
      errors.push({ path: "forbidden_context", message: `Must include ${required}.` })
    }
  }

  if (Number.isNaN(Date.parse(input.created_at))) {
    errors.push({ path: "created_at", message: "Expected ISO date string." })
  }

  return errors.length ? fail(errors) : ok(input)
}
