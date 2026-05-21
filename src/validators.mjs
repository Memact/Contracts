export function ok(value) {
  return { ok: true, value }
}

export function fail(errors) {
  return { ok: false, errors }
}

export function validateObject(value, rules) {
  const errors = []
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fail([{ path: "", message: "Expected object." }])
  }
  for (const rule of rules) {
    const current = value[rule.key]
    const path = rule.key
    if (rule.required && (current === undefined || current === null || current === "")) {
      errors.push({ path, message: "Required field is missing." })
      continue
    }
    if (current === undefined || current === null) continue
    if (rule.type && !matchesType(current, rule.type)) {
      errors.push({ path, message: `Expected ${rule.type}.` })
    }
    if (rule.min !== undefined && Number(current) < rule.min) {
      errors.push({ path, message: `Must be at least ${rule.min}.` })
    }
    if (rule.max !== undefined && Number(current) > rule.max) {
      errors.push({ path, message: `Must be at most ${rule.max}.` })
    }
    if (rule.oneOf && !rule.oneOf.includes(current)) {
      errors.push({ path, message: `Must be one of: ${rule.oneOf.join(", ")}.` })
    }
    if (rule.const && current !== rule.const) {
      errors.push({ path, message: `Must be ${rule.const}.` })
    }
  }
  return errors.length ? fail(errors) : ok(value)
}

function matchesType(value, type) {
  if (type === "array") return Array.isArray(value)
  if (type === "object") return Boolean(value && typeof value === "object" && !Array.isArray(value))
  return typeof value === type
}
