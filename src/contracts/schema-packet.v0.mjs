import { validateObject } from "../validators.mjs"

export function validateSchemaPacket(value) {
  return validateObject(value, [
    { key: "schema_version", const: "memact.schema_packet.v0" },
    { key: "packet_id", type: "string", required: true },
    { key: "category", type: "string", required: true },
    { key: "schema_type", type: "string", required: true },
    { key: "sub_schema", type: "string" },
    { key: "confidence", type: "number", required: true, min: 0, max: 1 },
    { key: "attributes", type: "object", required: true },
    { key: "sources", type: "array", required: true },
    { key: "created_at", type: "string", required: true }
  ])
}
