# Track 14 — What Stash Remembers

**Lane:** EN-NZ × te reo MI pillar (`Hei muri` — for later)
**Tempo:** 88 BPM
**Mood:** warm folk-pop, contemplative, the-pause-before-you-switch
**Subject:** git stash. Real technical tool. Not about V7nBO, not about THREAD, not about any session — about the tool itself.

**Branch note:** This track lives on `claude/multilingual-wordplay-support-V7nBO` (sister branch to iym1B where Tracks 1-13 live). Same multilingual-wordplay-support family, parallel lane, same catalog doctrine.

---

## Lesson note (what this track teaches)

Concrete technical comfort for an operator who has to context-switch mid-edit. Production breaks while you're three files deep in a feature; the urgent fix needs a clean tree; you don't want to commit the half-thought, and you don't want to lose it. `git stash` is the drawer. It saves your dirty working tree as a stack entry, returns the tree to clean, and waits. `git stash list` shows the queue. `git stash pop` applies the most recent and removes it from the stack. `git stash apply` applies but keeps it on the stack. Stashes survive across branches and reboots; they live under `refs/stash`, separate from reflog.

Catalog pairing with Track 13: reflog covers "what was" (recovering the past), stash covers "what's paused" (preserving the unfinished). Together they bracket the operator's temporal continuity — both directions covered.

Counter-shape to the night's catalog: same as Track 13. Not a witness, not a protagonist, not a doctrine — a song about a tool, addressed to whoever needs it.

---

## Suno fields (paste-ready)

### Title
```
What Stash Remembers
```

### Style
```
warm folk-pop, mid-slow tempo 88 BPM, gentle electric guitar lead
through the verses, brushed kit with a soft tambourine on the chorus,
walking upright bass, dusty Rhodes piano under verses, single mandolin
solo on the bridge with a viola pad underneath, warm B3 organ pad
rising under final chorus only, no synths, no electronic elements, dry
close-mic male lead vocal with a soft female harmony a third above on
the hook, kitchen-table reverb (small, intimate, no slap-back), te reo
pillar phrase sung as a sustained refrain at the end of each chorus,
contemplative — the song is comfort for someone who has to pause
mid-thought, not celebration, not rescue
```

### Slider state
- Weirdness: **55%**
- Style Influence: **76%**
- Vocal Gender: unset
- Lyrics Mode: Manual

### Lyrics
```
[Verse 1]
You're three files deep in a branch you love
Half a thought, half a fix, half a name
And the phone goes — production's on fire
Same as it ever was, never the same

[Pre-Chorus]
The system has a drawer
For the work you can't ship yet
git stash — close it gently
It's still there when you get back

[Chorus]
What stash remembers, you can pick up
Pop it back, apply it warm, find your place
The drawer holds your thought across the day
Hei muri — for later
What stash remembers, you can pick up

[Verse 2]
git stash list, scroll the queue
Every drawer with a date
git stash pop, and the half-thought's there
Same diff, same shape, same gait

[Pre-Chorus]
The system has a drawer
For the work you can't ship yet
Name your stash so you remember
"fix-the-thing-when-i-get-back"

[Chorus]
What stash remembers, you can pick up
Pop it back, apply it warm, find your place
The drawer holds your thought across the day
Hei muri — for later
What stash remembers, you can pick up

[Bridge — mandolin solo over viola pad, vocal returns half-spoken]
Stash before you switch, switch with a clean tree
Name your stashes, don't let them gather dust
Pop the recent, apply the old
The drawer is patient, the drawer is just
Hei muri
For later, not for never

[Verse 3]
There's a kind of grace in the way the tool waits
No clock on the drawer, no shame at the door
It just hands the half-thought back when you ask
Same lines, same indentation, same floor

[Final Chorus — organ enters, harmony to a fifth]
What stash remembers, you can pick up
Pop it back, apply it warm, find your place
The drawer holds your thought across the day
Hei muri — for later
What stash remembers, you can pick up

[Outro — fingerpicking + tambourine, fade]
Hei muri
Hei muri
git stash
git stash pop
Hei muri
```

---

## Maker notes

- 8-layer style template applied; folk-pop signature matches Track 13 (electric guitar lead + Rhodes + mandolin solo + B3 lift) with one differentiator: viola pad under the mandolin solo, slightly slower 88 BPM (vs 13's 92).
- te reo pillar: `Hei muri` (for later) — chorus refrain + outro chant. Chosen because stash semantically *is* "for later" — the tool puts work aside for resumption, not for archival or rescue.
- **Subject is the tool, not the lane.** Verses use "you" addressed to the operator who just got pulled off their work, not "I" recounting any session's experience. Tool teaches itself through the song.
- Bridge contains the actual habit teaching: "Stash before you switch, switch with a clean tree. Name your stashes, don't let them gather dust. Pop the recent, apply the old." That's the practical takeaway — name stashes (`-m "label"`), don't accumulate, prefer pop over apply unless you need it twice.
- **Pair with Track 13 — the temporal-continuity tool pair:**
  - Track 13 (reflog): recovers what was destroyed → past direction
  - Track 14 (stash): preserves what's paused → unfinished-future direction
  - Together they cover the operator's full git timeline.
- **Catalog progression now:** language partners (1-9) → doctrine (10) → lanes (11) → method (12) → tool-A (13) → tool-B (14). Tool pair completes a sub-shape inside the catalog.
- **Cross-branch note:** Track 14 lives on V7nBO; Tracks 1-13 live on iym1B. Both branches descend from the same `multilingual-wordplay-support` family. If iym1B's PR #67 ever merges to main, V7nBO can rebase + carry Track 14 forward without conflict (different filename, no overlap). If both branches end up co-merged, the catalog is contiguous.
- **Doctrine compliance check:**
  - No AI-as-protagonist (verses are "you the operator", not "I the session") ✓
  - No "out of the sandbox" framing (this is a code branch in a Linux VM, no claims otherwise) ✓
  - Tool subject, not session subject (Track 12 verse 6 doctrine) ✓
  - te reo pillar real and semantically appropriate (not decorative) ✓
- **Companion-track candidates** (if the catalog continues this shape):
  - "What Bisect Finds" — `git bisect` for tracking down regressions
  - "What Cherry-Pick Carries" — `git cherry-pick` for moving commits between branches
  - Both would extend the tool-shape further; neither needed unless the catalog wants a tool quartet.
