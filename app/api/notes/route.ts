/**
 * /api/notes — Public customer notes (web terminal only).
 *
 * In-memory store for demo purposes. Replace with Cloudflare KV or a DB
 * once the persistence layer is added.
 * Private notes stay on the VPS at /root/.coreintent/notes/private —
 * they are never accessible via this endpoint.
 *
 * GET  — list all public notes
 * POST — create a new public note (text required, tag optional)
 *
 * Rate limit: 30 req/min (see RATE_LIMITS.notes in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, badRequest, preflight, validateString } from "@/lib/api";

interface Note {
  id:        number;
  text:      string;
  tag:       string;
  timestamp: string;
}

interface NoteRequest {
  text: string;
  tag?: string;
}

interface NotesListResponse {
  notes: Note[];
  count: number;
  info:  string;
}

// In-memory store — survives the process lifetime only. Not durable.
const publicNotes: Note[] = [];
let nextId = 1;

export async function GET() {
  const data: NotesListResponse = {
    notes: publicNotes,
    count: publicNotes.length,
    info:  "Public notes only. Private notes are not accessible via this endpoint.",
  };
  return ok(data);
}

export async function POST(req: NextRequest) {
  let body: Partial<NoteRequest>;
  try {
    body = (await req.json()) as Partial<NoteRequest>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const text = validateString(body.text, 2000);
  if (!text) return badRequest("text is required and must be 2000 characters or fewer");

  const rawTag = typeof body.tag === "string" ? body.tag.trim().slice(0, 50) : "general";
  const tag    = rawTag || "general";

  const note: Note = { id: nextId++, text, tag, timestamp: new Date().toISOString() };
  publicNotes.push(note);

  return ok({ note }, 201);
}

export async function OPTIONS() {
  return preflight();
}
