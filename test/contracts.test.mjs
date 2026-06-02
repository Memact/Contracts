import test from "node:test"
import assert from "node:assert/strict"
import {
  validateCaptureEvent,
  validateAppContextSignal,
  validateContextProposal,
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
    feature_id: "adaptive-article-overview",
    name: "Adaptive Article Overview",
    description: "Creates article overviews from approved reading memory.",
    required_scopes: [],
    required_schema_types: [],
    input_contract: "memact.schema_packet.v0",
    output_contract: "memact.feature_run_result.v0"
  }).ok, true)
})

test("valid app context signal and proposal pass", () => {
  assert.equal(validateAppContextSignal({
    schema_version: "memact.app_context_signal.v0",
    event_type: "playlist_replay",
    source_app: "music-app",
    occurred_at: new Date().toISOString(),
    category: "music",
    payload: { genre: "Brazilian phonk" }
  }).ok, true)

  assert.equal(validateContextProposal({
    schema_version: "memact.context_proposal.v0",
    input_kind: "raw_signal",
    category: "music",
    title: "Possible music context",
    context: { evidence: { genre: "Brazilian phonk" } },
    confidence: 0.35,
    status: "pending",
    visibility: "private",
    source_trail: [],
    created_at: new Date().toISOString()
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
