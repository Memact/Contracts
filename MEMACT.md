# Memact Contributor Handoff

Memact is where users see what apps know about them and control it.

Contracts keeps the repos from inventing incompatible shapes.

## The idea

An app may suggest memory directly:

```text
User prefers high-energy music.
```

Or it may send specific app activity:

```text
User replayed Brazilian phonk playlists often this month and skipped slow acoustic playlists.
```

Those are not the same thing.

Contracts defines the shapes for both paths so Access, SDK, Context, Wiki, and
Memory agree.

## Current Objects

- `AppContextProposal`: a memory suggestion waiting for user review.
- `WikiEntry`: accepted, pending, edited, rejected, or deleted user-visible memory.
- `CategorySchema`: a Context category rule.
- `MemorySummary`: compact memory an app may read after consent.
- `TaskContextPacket`: a small approved-memory packet for a Memact worker.
- `SDKResponse`: response shape for SDK helpers.

Compatibility objects for older Capture, Inference, Schema packet, and feature
work remain so old integrations and contributor PRs do not break.

## Rules

- Activity is not identity.
- Users control what becomes memory.
- Default visibility should be private.
- Apps should not get full Wiki access.
- Apps should only get relevant category memory with permission.
- Memact workers should only receive task-specific approved fragments.
- Prefer readable memory suggestions over raw personal data.
- Do not infer sensitive traits.
- Do not write fake certainty.

## AI worker rule

Memact AI is memory-blind by default.

A worker gets a `TaskContextPacket`, not the full Wiki, not the full Memory
store, and not raw app activity. Today this can run with a mock/local worker.
Future model providers should plug into the same packet boundary.
