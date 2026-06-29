import test from "node:test"
import assert from "node:assert/strict"
import {
  validateCaptureEvent,
  validateAppContextSignal,
  validateAppContextProposal,
  validateCategorySchema,
  validateContextProposal,
  validateFeatureManifest,
  validateFeatureRunResult,
  validateMemorySummary,
  validateSchemaPacket,
  validateTaskContextPacket,
  validateCapRequest,
  validateCapPacket,
  validateContextProposalV1
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

test("compatibility app activity and context proposal contracts pass", () => {
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
    title: "Possible music memory",
    context: { evidence: { genre: "Brazilian phonk" } },
    confidence: 0.35,
    status: "pending",
    visibility: "private",
    source_trail: [],
    created_at: new Date().toISOString()
  }).ok, true)
})

test("valid app context proposal and memory summary pass", () => {
  assert.equal(validateAppContextProposal({
    schema_version: "memact.app_context_proposal.v0",
    category: "fitness",
    title: "Prefers strength workouts",
    source_app: "NutriPlan Lite",
    context: { preference: "strength workouts" },
    confidence: 0.72,
    status: "pending",
    visibility: "private",
    source_trail: [{ type: "app_evidence", evidence: ["completed workout plan"] }]
  }).ok, true)

  assert.equal(validateMemorySummary({
    schema_version: "memact.memory_summary.v0",
    memory_id: "mem_1",
    memory_type: "fitness_preference",
    category: "fitness",
    subject: "Prefers strength workouts",
    confidence: 0.72,
    source_count: 1,
    created_at: new Date().toISOString()
  }).ok, true)
})

test("valid task context packet passes", () => {
  const result = validateTaskContextPacket({
    schema_version: "memact.task_context_packet.v0",
    packet_id: "tcp_001",
    actor: { type: "memact_worker", id: "worker:onboarding-prefill" },
    purpose: "onboarding_prefill",
    target_app_id: "nutriplan-lite",
    connection_id: "conn_123",
    allowed_context: [
      {
        field_path: "diet.preference",
        value: "vegetarian",
        category: "fitness",
        sensitivity: "normal",
        source: "accepted_user_memory"
      },
      {
        field_path: "diet.allergy",
        value: "peanuts",
        category: "fitness",
        sensitivity: "sensitive",
        source: "user_verified_memory"
      }
    ],
    forbidden_context: ["full_profile", "raw_capture_events", "unapproved_memory"],
    retention: "none",
    requires_user_review: true,
    created_at: new Date().toISOString()
  })
  assert.equal(result.ok, true)
})

test("invalid task context packet rejects full-profile unsafe shape", () => {
  const result = validateTaskContextPacket({
    schema_version: "memact.task_context_packet.v0",
    packet_id: "tcp_bad",
    actor: { type: "personal_ai", id: "worker:bad" },
    purpose: "onboarding_prefill",
    target_app_id: "nutriplan-lite",
    connection_id: "conn_123",
    allowed_context: [
      {
        field_path: "profile",
        value: { full_name: "Example User", full_profile: true },
        category: "all",
        sensitivity: "high",
        source: "full_profile_dump"
      }
    ],
    forbidden_context: ["raw_capture_events", "unapproved_memory"],
    retention: "session",
    requires_user_review: true,
    created_at: new Date().toISOString()
  })
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.path === "actor.type"))
  assert.ok(result.errors.some((error) => error.path === "forbidden_context"))
  assert.ok(result.errors.some((error) => error.path === "retention"))
})

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

test("valid CAP request passes", () => {
  const result = validateCapRequest({
    schema_version: "memact.cap_request.v0",
    request_id: "cap_req_1",
    app_id: "food-app",
    connection_id: "con_1",
    purpose: "onboarding_prefill",
    requested_context: [
      { description: "food restrictions", field_hint: "diet.restrictions", category_hint: "food", required: true }
    ],
    requested_categories: ["food", "fitness"],
    requested_scopes: ["cap:request"],
    created_at: new Date().toISOString()
  })
  assert.equal(result.ok, true)
})

test("invalid CAP request missing requested context fails", () => {
  const result = validateCapRequest({
    schema_version: "memact.cap_request.v0",
    request_id: "cap_req_bad",
    app_id: "food-app",
    purpose: "onboarding_prefill",
    requested_context: [],
    created_at: new Date().toISOString()
  })
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.path === "requested_context"))
})

test("valid CAP packet passes", () => {
  const result = validateCapPacket({
    schema_version: "memact.cap_packet.v0",
    packet_id: "cap_pkt_1",
    request_id: "cap_req_1",
    app_id: "food-app",
    connection_id: "con_1",
    purpose: "onboarding_prefill",
    allowed_context: [
      {
        field_path: "diet.allergy",
        value: "peanuts",
        category: "food",
        sensitivity: "sensitive",
        source: "user_verified_memory",
        confidence: 1
      }
    ],
    missing_context: [{ description: "cuisine preference", required: false, reason: "No approved matching memory." }],
    forbidden_context: ["full_profile", "raw_capture_events", "unapproved_memory"],
    retention: "none",
    requires_user_review: true,
    created_at: new Date().toISOString()
  })
  assert.equal(result.ok, true)
})

test("invalid CAP packet rejects forbidden full profile data", () => {
  const result = validateCapPacket({
    schema_version: "memact.cap_packet.v0",
    packet_id: "cap_pkt_bad",
    request_id: "cap_req_bad",
    app_id: "food-app",
    connection_id: "con_1",
    purpose: "onboarding_prefill",
    allowed_context: [
      {
        field_path: "profile",
        value: { full_profile: true },
        category: "all",
        sensitivity: "high",
        source: "full_profile_dump"
      }
    ],
    missing_context: [],
    forbidden_context: ["full_profile", "raw_capture_events", "unapproved_memory"],
    retention: "none",
    requires_user_review: false,
    created_at: new Date().toISOString()
  })
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.path.includes("allowed_context")))
})

test("valid context proposal v1 passes", () => {
  const result = validateContextProposalV1({
    schema_version: "memact.context_proposal.v1",
    proposal_id: "ctx_prop_1",
    app_id: "fitness-app",
    connection_id: "con_1",
    source_type: "app",
    category: "fitness",
    field_path: "fitness.goal",
    proposed_value: "strength",
    evidence_summary: "User selected strength training in onboarding.",
    confidence: 0.82,
    status: "pending",
    sensitivity: "normal",
    visibility: "private",
    created_at: new Date().toISOString()
  })
  assert.equal(result.ok, true)
})

test("invalid context proposal v1 status fails", () => {
  const result = validateContextProposalV1({
    schema_version: "memact.context_proposal.v1",
    proposal_id: "ctx_prop_bad",
    app_id: "fitness-app",
    connection_id: "con_1",
    source_type: "app",
    category: "fitness",
    field_path: "fitness.goal",
    proposed_value: "strength",
    confidence: 0.82,
    status: "accepted",
    sensitivity: "normal",
    visibility: "private",
    created_at: new Date().toISOString()
  })
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.path === "status"))
})
