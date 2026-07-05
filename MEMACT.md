# Memact Contracts

Memact defines open protocols so that apps and providers can speak the same language when requesting or contributing context.

## What Contracts Does

This repository contains the official validation schemas and formats. It ensures all parties format messages correctly.

Contracts defines validation for:
- User identity addresses (validation and parsing).
- CAP messages (context access request and response shapes).
- CCP messages (observation contribution shapes, including entry type and evidence).
- Provider configurations (the `.well-known/memact-configuration` discovery metadata).
- Memory records (how approved context is structured in the database).

## Deprecations

Older, pre-2026 data formats are deprecated and will be removed in the future:
- `capture-event.v0` (replaced by CCP contribution shapes).
- `inference-record.v0` (retired; inference is now internal to the provider).
- `feature-manifest.v0` and `feature-run.v0` (retired; runtime features are removed from the protocol).

## Versioning

All schemas are versioned. Breaking changes require a version increment.

## License

Apache 2.0. The schemas are open and free.
