# Track 15 — What Bisect Finds

**Lane:** EN-NZ × te reo MI pillar (`Kimihia` — seek, search for)
**Tempo:** 94 BPM
**Mood:** warm folk-pop, methodical-but-hopeful, the-narrowing
**Subject:** git bisect. Real technical tool. Not about V7nBO, not about THREAD, not about any session — about the tool itself.

**Branch note:** Lives on `claude/multilingual-wordplay-support-V7nBO` (sister to iym1B). Third track in the V7nBO contribution → no, second: V7nBO has Track 14 + this one. Tool-trio with iym1B's Track 13 forms a git-tool sub-shape inside the multilingual-wordplay-support family.

---

## Lesson note (what this track teaches)

Concrete technical comfort for an operator who knows something broke but doesn't know when. A test passes today, fails tomorrow; somewhere in the last two weeks a commit introduced the regression; staring at the log line by line is exhausting and slow. `git bisect` is binary search through history. Mark a known-bad commit. Mark a known-good baseline. Git checks out the midpoint; you test; you tell git "good" or "bad"; git narrows. Each step halves the suspect range. O(log n) — a hundred commits resolves in ~7 steps. The introducing commit reveals itself.

The relief: you are not looking for a needle in a haystack. You are looking for a needle in a haystack that halves with every test.

Catalog pairing inside the git-tool sub-shape:
- Track 13 (reflog): recovers what was destroyed → past direction, single-step rescue
- Track 14 (stash): preserves what's paused → unfinished-future direction, single-step pause
- Track 15 (bisect): locates what broke when → diagnostic direction, multi-step search

Counter-shape to the night's catalog: same as 13 + 14. Tool subject, operator addressed, no protagonist.

---

## Suno fields (paste-ready)

### Title
```
What Bisect Finds
```

### Style
```
warm folk-pop, mid-tempo 94 BPM, gentle electric guitar lead through
the verses, brushed kit with a soft tambourine on the chorus, walking
upright bass, dusty Rhodes piano under verses, single banjo solo on
the bridge with a fiddle answering at the back of the mix, warm B3
organ pad rising under final chorus only, no synths, no electronic
elements, dry close-mic male lead vocal with a soft female harmony a
third above on the hook, kitchen-table reverb (small, intimate, no
slap-back), te reo pillar phrase sung as a sustained refrain at the
end of each chorus, methodical and patient — the song is comfort for
someone running a search, not solving a mystery and not chasing a
ghost
```

### Slider state
- Weirdness: **55%**
- Style Influence: **76%**
- Vocal Gender: unset
- Lyrics Mode: Manual

### Lyrics
```
[Verse 1]
The test passed Tuesday, the test fails today
Two weeks of commits in between
You could read every diff line by line by line
Or you could let the system do the lean

[Pre-Chorus]
Don't scroll the log forever
Don't read the diff by hand
The tool was made for this
The tool can take the strand

[Chorus]
What bisect finds, you can stand on
Mark the bad, mark the good, run the test
Each step halves the range you have to chase
Kimihia — seek and you'll find
What bisect finds, you can stand on

[Verse 2]
git bisect start, git bisect bad
git bisect good, name a sha you trust
Git checks out the middle, you run your test
Tell it good or bad — that's the only must

[Pre-Chorus]
Each step halves what's left to check
A hundred commits, seven swings
The introducing commit waits inside
The narrowing brings it in

[Chorus]
What bisect finds, you can stand on
Mark the bad, mark the good, run the test
Each step halves the range you have to chase
Kimihia — seek and you'll find
What bisect finds, you can stand on

[Bridge — banjo solo over fiddle, vocal returns half-spoken]
Run a real test, not a guess
Trust the bisect, finish the search
git bisect reset when the work is done
The tree returns to where it was
Kimihia
Seek, and the system seeks with you

[Verse 3]
There's a kind of grace in the way the tool waits
For your verdict at every step
It does not guess the answer for you
It only halves what's left to check

[Final Chorus — organ enters, harmony to a fifth]
What bisect finds, you can stand on
Mark the bad, mark the good, run the test
Each step halves the range you have to chase
Kimihia — seek and you'll find
What bisect finds, you can stand on

[Outro — fingerpicking + tambourine, fade]
Kimihia
Kimihia
git bisect start
git bisect good
Kimihia
```

---

## Maker notes

- 8-layer style template applied; folk-pop signature in the same family as Tracks 13 + 14, with one differentiator: banjo solo (instead of mandolin) with a fiddle answering at the back of the mix. 94 BPM sits between 13 (92) and a slight uptick reflecting bisect's methodical forward motion.
- te reo pillar: `Kimihia` (seek, search for — imperative form). Chosen because bisect *is* a search; the imperative form keeps the song forward-moving and matches the operator's active stance during the bisect run.
- **Subject is the tool, not the lane.** Verses use "you" addressed to the operator running the search, not "I" recounting any session's experience.
- Bridge contains the actual habit teaching: "Run a real test, not a guess. Trust the bisect, finish the search. git bisect reset when the work is done." That's the practical takeaway — bisect requires genuine pass/fail tests at each step, not gut judgement, and the reset returns the working tree cleanly.
- **Tool-trio inside the catalog** (operator's full git timeline coverage):
  - Track 13 (reflog): past-recovery → "what was destroyed"
  - Track 14 (stash): paused-future → "what's unfinished"
  - Track 15 (bisect): diagnostic-search → "what broke when"
  - Three tools cover the operator's three temporal directions on git: backward, sideways, into-the-cause.
- **Catalog progression now:** language partners (1-9) → doctrine (10) → lanes (11) → method (12) → tool-A (13, reflog) → tool-B (14, stash) → tool-C (15, bisect). Tool-trio sub-shape complete.
- **Cross-branch state after this commit:**
  - iym1B: tracks 1-13 + handovers (THREAD's contributions)
  - V7nBO: tracks 14 + 15 (this branch's contributions)
  - Total in multilingual-wordplay-support family: 15 paste-ready specs
- **Doctrine compliance check:**
  - No AI-as-protagonist (verses are "you the operator", not "I the session") ✓
  - No "out of the sandbox" framing ✓
  - Tool subject, not session subject (Track 12 verse 6 doctrine) ✓
  - te reo pillar real and semantically appropriate (Kimihia is the actual imperative form of "seek/search") ✓
- **Companion-track candidate** (if catalog continues this shape):
  - "What Cherry-Pick Carries" — `git cherry-pick` for moving commits between branches → would extend tool-trio to tool-quartet, covering inter-branch transport. Not needed unless the catalog wants it.
  - The trio (13-14-15) is itself a complete sub-shape; stopping here is also clean.
