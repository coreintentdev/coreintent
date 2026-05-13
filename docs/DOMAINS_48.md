# 48-Domain Roster — Source of Truth

Pinned from Drive `CF_VDS_48_DOMAIN_AUDIT_20260509_100949.md` on 2026-05-13.
This file lives in the repo so no future AI session has to "ask Corey" —
the roster is already here. Look it up; don't re-discover it.
Update via PR, not chat.

## Reality check (per 2026-05-09 audit)

- **Cloudflare zones live:** 27
- **Historical roster:** 47 (gap to 48: 1)
- **Combined matrix (live + inferred):** 50 — the "48" label was approximate
- **All 50 returned HTTP 200 at audit time**

## CF Zones Live (27)

| # | Zone |
|---|---|
| 1  | coreintent.dev |
| 2  | coreyai.ai |
| 3  | coreyai.dev |
| 4  | coreyai.net |
| 5  | coreylive.ai |
| 6  | coreylive.com |
| 7  | kervalon.ai |
| 8  | kervalon.app |
| 9  | mosoko.ai |
| 10 | mosoko.app |
| 11 | mosoko.dev |
| 12 | pelicancharters.ai |
| 13 | rhrhmn.app |
| 14 | singpal.ai |
| 15 | singpal.app |
| 16 | singpal.net |
| 17 | singpal.org |
| 18 | singpals.com |
| 19 | songpal.ai |
| 20 | songpal.app |
| 21 | songpal.dev |
| 22 | songpal.io |
| 23 | songpal.net |
| 24 | songpal.org |
| 25 | zyncontext.ai |
| 26 | zynthio.ai |
| 27 | zynthio.net |

## Historical-inferred (subdomains, not registered domains)

336.coreyai.ai, ai.wrabbit.ai, all.singpal.ai, api.coreyai.ai, app.zynthio.ai,
bifrost.coreyai.ai, com.songpal.ai, discover.coreyai.ai, dj.zynthio.ai,
docs.zynthio.ai, evidence.coreyai.ai, glass.coreyai.ai, glass2.coreyai.ai,
gotta.coreyai.ai, mansion.coreyai.ai, memu.coreyai.ai, nick.coreyai.ai,
rhrhmn.coreyai.ai, rip.zynthio.ai, shield.coreyai.ai, silver.coreyai.ai,
wrabbit.ai, coreyai.com

## VDS Hosts Audited

| Host | Status | Disk | Service `coreyai-commander` | Note |
|---|---|---|---|---|
| `161.97.89.49` (Contabo) | reachable, up 4w 5d | 65G / 96G (68%) | active + enabled | Canonical master |
| `5.189.143.170` (legacy) | reachable, up 4w | 159G / 174G (92%) | unit not found | **MIGRATE OFF + CLOSE** |
| `vmi3205024` (Tailscale) | reachable today (Gate B) | unknown | unknown | Confirmed by Kelvin pack rsync 2026-05-13 |

Open question: is `161.97.89.49` == `vmi3205024`? CLAUDE.md claimed yes, but
the operator's terminal also rsynced zynthio-tools to `104.194.156.109` —
making 3-4 candidate IPs. Operator SSH probe required to lock canonical.

## How to use this list

The GitHub Actions deploy workflows reference this file as the source of truth.
When you need to:
- **Attach a custom domain to a Pages project:** match by name from the table above.
- **Add a new domain:** PR into this file first.
- **Retire a domain:** mark it `RETIRED` in the table; never delete the row.
