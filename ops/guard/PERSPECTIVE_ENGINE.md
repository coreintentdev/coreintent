# Perspective Engine — Specification

## Purpose

Coordinate multiple perspectives on the same problem, force verification before execution, and leave an auditable trail of assumptions, verdicts, and consequences.

## Layers in detail

### Layer 1 — Executor
- **Goal:** produce the proposed action.
- **Mandate:** state assumptions explicitly; do not assume network state, file state, or permissions.
- **Output:** `action`, `assumptions[]`, `risks[]`.

### Layer 2 — Verifier
- **Goal:** stop unsafe or unverified actions.
- **Mandate:** reject the action if any assumption lacks evidence. Ask for proof, not belief.
- **Output:** `verdict` (`proceed` / `blocked` / `needs-evidence`), `gaps[]`, `required_proofs[]`.

### Layer 3 — Investigator
- **Goal:** find blind spots and edge cases.
- **Mandate:** consider rollback, cost, observability, and what happens when the action fails.
- **Output:** `blind_spots[]`, `mitigations[]`, `rollback_plan`.

### Layer 4 — User-Defined Roles
- **Goal:** add domain lenses (legal, infra, cost, security, etc.).
- **Mandate:** defined in `roles.yaml`; each role can vote `approve`, `block`, or `ask`.
- **Output:** `role`, `lens`, `assessment`, `vote`.

### Layer 5 — Report / Site Layer
- **Goal:** render the structured result for humans.
- **Rule:** read-only renderer. Never the source of truth.

### Layer 6 — Consequence Engine
- **Goal:** close the loop between perspectives and reality.
- **Mandate:** record the actual outcome; nudge each role's weight by `policy.weight_delta`; clamp inside `policy.weight_bounds`.
- **Output:** updated `weights.json` and `truth.jsonl`.

### Layer 7 — Perspective Mesh
- **Goal:** compare outputs from independent model instances.
- **Mandate:** surface consensus, dissent, and shared assumptions (meta blind spots).
- **Output:** `consensus`, `dissenters[]`, `shared_assumptions[]`, `confidence`.

## Decision flow

```text
Task
  └─> Layer 1: Executor proposes action
       └─> Layer 2: Verifier gates it
            └─> Layer 3: Investigator finds blind spots
                 └─> Layer 4: Domain roles vote
                      └─> Layer 5: Render report
                           └─> Human executes
                                └─> Layer 6: Record outcome
                                     └─> Layer 7: Compare with mesh
```

## JEV output format

Every layer-5 report should produce a JSON object matching `jev-schema.yaml`:

```json
{
  "judgment": "proceed|blocked|needs-evidence",
  "evidence": { "proofs": [], "gaps": [], "blind_spots": [] },
  "verdict": { "consensus": "...", "dissent": [], "confidence": 0.0 }
}
```

## Extending

- Add roles in `roles.yaml` without touching code.
- Change safety policy in `policy.yaml`.
- Add model commands to `mesh.sh` via `MESH_CMD_*` env vars.
