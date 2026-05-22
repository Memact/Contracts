# Memact Contracts

Contracts define the data shapes used by the Memact SDK, backend, and feature runtime.

They are small validators, not storage or network code.

If a contributor is unsure how a feature or SDK call should shape its data, this
repo is the first place to check.

## Owns

- Capture event shape.
- Inference record shape.
- Schema packet shape.
- Memory record shape.
- Feature manifest, request, and result shapes.
- Access policy and API error shapes.

## Does Not Own

- API key verification.
- Capture storage.
- Inference logic.
- Feature execution.
- Memory retrieval.

## Current Code

Validators return:

```js
{ ok: true, value }
```

or:

```js
{ ok: false, errors: [{ path, message }] }
```

The package exports validators for capture events, inference records, schema
packets, memory records, feature manifests, feature run requests/results,
access policies, and API errors.

## Consent and Wiki Examples

The `examples/` folder includes small request examples for:

- Connect/consent links before app access.
- Wiki links after app access.

These examples are intentionally simple. Access owns permission checks; Website owns the user-facing pages.

## Development

```powershell
npm install
npm run check
```
