# Memact Contracts

Contracts define the data shapes used by the Memact SDK, backend, and feature runtime.

They are small validators, not storage or network code.

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

## Development

```powershell
npm install
npm run check
```
