import test from "node:test"
import assert from "node:assert/strict"
import {
  validateCaptureEvent,
  validateFeatureManifest,
  validateFeatureRunResult,
  validateSchemaPacket
} from "../src/index.mjs"

test("valid capture event passes", () => {
  const result = validateCaptureEvent({
    schema_version: "memact.capture_event.v0",
    event_type: "article_read",
    source_app: "app",
    occurred_at: new Date().toISOString(),
    category: "web:research",
    payload: {}
  })
  assert.equal(result.ok, true)
})

test("missing event_type fails", () => {
  const result = validateCaptureEvent({
    schema_version: "memact.capture_event.v0",
    source_app: "app",
    occurred_at: new Date().toISOString(),
    category: "web:research",
    payload: {}
  })
  assert.equal(result.ok, false)
})

test("invalid confidence fails", () => {
  const result = validateSchemaPacket({
    schema_version: "memact.schema_packet.v0",
    packet_id: "pkt_1",
    category: "research",
    schema_type: "research",
    confidence: 2,
    attributes: {},
    sources: [],
    created_at: new Date().toISOString()
  })
  assert.equal(result.ok, false)
})

test("valid schema packet and feature manifest pass", () => {
  assert.equal(validateSchemaPacket({
    schema_version: "memact.schema_packet.v0",
    packet_id: "pkt_1",
    category: "research",
    schema_type: "research",
    confidence: 0.8,
    attributes: {},
    sources: [],
    created_at: new Date().toISOString()
  }).ok, true)
  assert.equal(validateFeatureManifest({
    schema_version: "memact.feature_manifest.v0",
    feature_id: "user-context-wiki",
    name: "User Context Wiki",
    description: "Groups context.",
    required_scopes: [],
    required_schema_types: [],
    input_contract: "memact.schema_packet.v0",
    output_contract: "memact.feature_run_result.v0"
  }).ok, true)
})

test("invalid feature result status fails", () => {
  assert.equal(validateFeatureRunResult({
    schema_version: "memact.feature_run_result.v0",
    feature_id: "x",
    status: "maybe",
    output: {},
    errors: [],
    generated_at: new Date().toISOString()
  }).ok, false)
})
