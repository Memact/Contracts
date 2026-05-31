import { validateObject } from "../validators.mjs"

export function validateCategorySchema(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.category_schema.v0" },
    { key: "id",          type: "string",  required: true },
    { key: "name",        type: "string",  required: true },
    { key: "version",     type: "string",  required: true },
    { key: "description", type: "string" },
    { key: "contextFields",          type: "array" },
    { key: "exampleInputs",          type: "array" },
    { key: "normalizedOutputShape",  type: "object" },
    { key: "wikiTemplates",          type: "array" },
    { key: "permissionSuggestions",  type: "array" },
    { key: "safetyNotes", type: "string" }
  ])
}