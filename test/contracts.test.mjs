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
import { validateCategorySchema } from "../src/index.mjs"

test("valid minimal category schema passes", () => {
  const result = validateCategorySchema({
    schema_version: "memact.category_schema.v0",
    id: "cat-001",
    name: "Technology",
    version: "1.0.0"
  })
  assert.equal(result.ok, true)
})

test("valid full category schema passes", () => {
  const result = validateCategorySchema({
    schema_version: "memact.category_schema.v0",
    id: "cat-002",
    name: "Science",
    version: "2.0.0",
    description: "All science related categories",
    contextFields: ["field", "subfield"],
    exampleInputs: ["biology", "chemistry"],
    normalizedOutputShape: { id: "string", label: "string" },
    wikiTemplates: ["{{ScienceBox}}"],
    permissionSuggestions: ["read", "write"],
    safetyNotes: "Ensure accurate classification"
  })
  assert.equal(result.ok, true)
})

test("missing id fails", () => {
  const result = validateCategorySchema({
    schema_version: "memact.category_schema.v0",
    name: "Technology",
    version: "1.0.0"
  })
  assert.equal(result.ok, false)
})

test("missing name fails", () => {
  const result = validateCategorySchema({
    schema_version: "memact.category_schema.v0",
    id: "cat-003",
    version: "1.0.0"
  })
  assert.equal(result.ok, false)
})

test("missing version fails", () => {
  const result = validateCategorySchema({
    schema_version: "memact.category_schema.v0",
    id: "cat-004",
    name: "Health"
  })
  assert.equal(result.ok, false)
})

test("wrong type for contextFields fails", () => {
  const result = validateCategorySchema({
    schema_version: "memact.category_schema.v0",
    id: "cat-005",
    name: "Tech",
    version: "1.0.0",
    contextFields: "not-an-array"
  })
  assert.equal(result.ok, false)
})