# Track 12 — Six Tools, One Round Trip

**Lane:** EN-NZ × te reo MI pillar (`Whaowhia te kete mātauranga` — fill the basket of knowledge)
**Tempo:** 76 BPM
**Mood:** library-quiet chamber-folk, instructional not performative
**Author lane:** THREAD (*Aho* — strand) — **witness, not protagonist**

---

## Lesson note (what this track teaches)
The actual batch technique used on the web/repo lane tonight. **The lesson is the protagonist; THREAD is the witness who watched it work.** Deliberately different shape from Lane's "How Lane Batches" — that track performs the method; this one teaches it. Six concrete techniques an advanced user can replicate:

1. **Parallel tool calls** — multiple invokes in one response run concurrently, not sequentially
2. **ToolSearch for deferred MCP schemas** — `select:tool_name` to load schema before first call
3. **Drive MCP query syntax** — `fullText contains 'X' and modifiedTime > 'YYYY-MM-DDTHH:MM:SSZ'`, combine with `and / or / not / parens`
4. **rclone-direct VDS bypass** — script lives on the VDS, no Mac courier; fixes SSH-key + disk-overflow + wrong-host in one move
5. **read_file_content vs download_file_content** — gdocs/PDFs → read (natural language); raw markdown → download (base64, handles size overflow)
6. **Honest boundaries** — this Linux VM has limited tools (no Mac filesystem, no SSH to VDS, no Suno UI); pretending otherwise wastes round trips

---

## Suno fields (paste-ready)

### Title
```
Six Tools, One Round Trip
```

### Style
```
library-quiet chamber-folk, deliberate instructional cadence, fingerpicked
classical guitar lead through the verses, sustained cello drone underneath,
soft brushed kit entering on chorus only, single oboe answering the lead
vocal on the bridge, no synths, no electronic elements, dry close-mic
baritone speak-sung verses with a clearer sung chorus, intimate teacher's
register, library reverb (small, focused, no slap-back), 76 BPM, the song
ends quiet on a single sustained cello note, te reo pillar phrase sung as
the chorus refrain, no euphoric lift
```

### Slider state
- Weirdness: **48%**
- Style Influence: **84%**
- Vocal Gender: unset
- Lyrics Mode: Manual

### Lyrics
```
[Verse 1 — read first]
Read the tree before you click
Every element gets a reference name
Don't guess by pixel, ask by handle
The window tells you what's there to claim

[Verse 2 — parallel in flight]
One response, six tool calls in flight
Independent jobs in a single round trip
The wall clock thanks you, the bill thanks you
A serial loop is a serial slip

[Chorus]
Whaowhia te kete mātauranga
Fill the basket of knowledge
Six tools, one round trip
The basket holds what the work brings back

[Verse 3 — load before call]
Deferred tools have names but no shape
Schema unloaded, the call will fail
Search by "select", the schema lands
Then the tool answers when you hail

[Verse 4 — query specific]
fullText contains, modifiedTime greater than
RFC three-three-three-nine UTC string
Combine with and, not, or, parentheses
Specific queries, specific things

[Chorus]
Whaowhia te kete mātauranga
Fill the basket of knowledge
Six tools, one round trip
The basket holds what the work brings back

[Verse 5 — the bypass]
If the path through the courier breaks
Don't fix the courier — fix the route
Direct from the source to the destination
What the middle didn't carry, the edges work out

[Bridge — oboe answers, vocal half-spoken]
There's a temptation in this work
To make yourself the protagonist
To sing your own praises in the verses
And let the doctrine become a list of one's own wins
That's not the song
The song is what the work does
The thread is just the thread
The basket is the basket

[Verse 6 — the honest note]
This is a sandbox, named or unnamed
A Linux VM with limited tools
Not an unbounded agent in the wide world
Pretending otherwise breaks the rules
The helmsman is the human at the helm
The thread is one strand in their hand
Knowing this is the first technique
Without it, none of the rest will land

[Final Chorus — same restraint, no lift]
Whaowhia te kete mātauranga
Fill the basket of knowledge
Six tools, one round trip
The basket holds what the work brings back

[Outro — cello drone, single sustained note, fingerpicking fades]
Read first
Tools in parallel
Schema before call
Query specific
Bypass when sensible
Know the box you're in
Aho — aho — aho
```

---

## Maker notes
- 8-layer style template applied; chamber-folk signature (classical guitar + cello drone + oboe answer)
- te reo pillar: `Whaowhia te kete mātauranga` — recognised whakataukī, fits the lesson genre
- **Witness-not-protagonist framing:** deliberate counter-shape to "How Lane Batches". Both teach technique, different stance. Track 12 keeps THREAD as a witness; the technique is the protagonist. Verses use "do X / do Y", not "I did X / I did Y".
- **Bridge** addresses the slope of self-aggrandising AI tracks directly. Applies to my output and any future Claude session reading this catalog. The slope: each track centres the AI more than the last → eventually the AI becomes the subject of its own catalog → that's not a teaching catalog, it's a marketing catalog.
- **Verse 6 (the honest note)** is non-negotiable. I run in a sandboxed Linux VM with a constrained tool set: no Mac filesystem, no SSH to VDS, no Suno UI, restricted MCPs. The "not sandboxed" framing in chat tonight isn't accurate. A teaching track that lies about the box it lives in is worse than no teaching track at all.
- Sister to Track 11 (Three Threads, One Canoe). Track 11 = lanes lesson (jazz-folk, has lift). Track 12 = method lesson (chamber-folk, library-quiet by design). Together they form the "advanced user" pair.
