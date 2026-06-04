# Memact Contracts

Contracts define the shared data shapes used by the Memact SDK, Access backend,
Context category rules, Wiki, and Memory.

They are small validators, not storage or network code.

If a contributor is unsure how an SDK call or backend response should shape its
data, this repo is the first place to check.

## Owns

- App context proposal shape.
- Wiki entry shape.
- Category schema shape.
- Memory record and memory summary shapes.
- Task context packet shape for memory-blind Memact workers.
- Access policy and API error shapes.
- SDK response shape.

Compatibility validators remain for older Capture, Inference, Schema packet,
and feature-runtime work so old examples do not break while the product moves.

## Does Not Own

- API key verification.
- Context category algorithms.
- Wiki UI.
- Memory retrieval.
- App billing or credit policy.

## Current Code

Validators return:

```js
{ ok: true, value }
```

or:

```js
{ ok: false, errors: [{ path, message }] }
```

The current product objects are:

- `AppContextProposal`: an app suggestion that the user can accept, edit, reject, or delete.
- `WikiEntry`: accepted or pending memory visible to the user.
- `CategorySchema`: a developer-facing category rule.
- `MemorySummary`: a compact memory result an app may read after consent.
- `TaskContextPacket`: a small task-only packet for local/mock AI workers. It must not contain a full profile, raw activity, or unapproved memory.
- `SDKResponse`: the standard response wrapper.

## Task Context Packets

`memact.task_context_packet.v0` exists so future AI helpers do not get broad
memory access.

The packet contains only approved fragments for one task, one app, and one
connection. It also carries explicit forbidden context labels:

- `full_profile`
- `raw_capture_events`
- `unapproved_memory`

The current worker path can run without an LLM. Future OpenAI, local model, or
embedding workers should still receive only this packet.

## Development

```powershell
npm install
npm run check
```
