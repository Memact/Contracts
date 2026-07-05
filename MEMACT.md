# Memact — Contracts

Memact is open identity infrastructure.

Users own an identity address. Apps and providers exchange context through open protocols with well-defined schemas.

## What Contracts Does

Contracts is the **protocol schema repository** — the canonical source of truth for all data shapes in the Memact identity protocol.

Contracts defines validators and schemas for:
- **Identity addresses** — format, validation, parsing
- **CAP messages** — context access request and response shapes
- **CCP messages** — observation contribution shapes (including `entry_type` and `evidence`)
- **CRP messages** — rectification request shapes
- **Provider capability documents** — `.well-known/memact-configuration` schema
- **Memory records** — approved context entry shapes

## Deprecation Notice

The following schemas reflect the pre-2026 architecture and are deprecated. They will be removed in Contracts v2:

| Deprecated Schema | Replaced By |
|---|---|
| `capture-event.v0` | `observation-event.v1` (CCP) |
| `inference-record.v0` | (retired — normalization is provider-internal) |
| `feature-manifest.v0` | (retired — feature runtime removed from protocol) |
| `feature-run.v0` | (retired — same) |

## Versioning

All schemas are versioned. Breaking changes require a version increment. Deprecated schemas will be removed no sooner than 12 months after the deprecation notice.

## License

Apache 2.0.
