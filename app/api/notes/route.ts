/**
 * /api/notes — Public customer notes (web terminal only).
 *
 * In-memory store for demo purposes. Replace with Cloudflare KV or a DB
 * once the persistence layer is added.
 * Private notes stay on the VPS at /root/.coreintent/notes/private —
 * they are never accessible via this endpoint.
 *
 * GET  — list all public notes
 *   ?tag=general     — filter by tag (exact match)
 *   ?limit=50        — max notes returned (1–200, default 50; returns most recent)
 * POST — create a new public note (text required, tag optional)
 *
 * Rate limit: 30 req/min (see RATE_LIMITS.notes in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, created, badRequest, preflight, serverError, validateString, validateOptionalString, checkRateLimit, tooManyRequests } from "@/lib/api";

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
  notes:  Note[];
  count:  number;
  total:  number;
  info:   string;
}

// In-memory store — survives the process lifetime only. Not durable.
const publicNotes: Note[] = [];
let nextId = 1;

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const rl = await checkRateLimit(ip, "notes");
  if (rl.limited) return tooManyRequests(rl.retryAfter ?? 60);
  try {
    const tagParam = req.nextUrl.searchParams.get("tag")?.trim();
    const limitParam = req.nextUrl.searchParams.get("limit");

    let pageLimit = 50;
    if (limitParam !== null) {
      const parsed = parseInt(limitParam, 10);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 200) {
        return badRequest("limit must be an integer between 1 and 200");
      }
      pageLimit = parsed;
    }

    const filtered = tagParam
      ? publicNotes.filter((n) => n.tag === tagParam)
      : publicNotes;

    // Return most-recent N notes so the caller always gets the latest.
    const paged = filtered.slice(-pageLimit);

    const data: NotesListResponse = {
      notes: paged,
      count: paged.length,
      total: filtered.length,
      info:  "Public notes only. Private notes are not accessible via this endpoint.",
    };
    return ok(data);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "notes");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  let body: Partial<NoteRequest>;
  try {
    body = (await req.json()) as Partial<NoteRequest>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const text = validateString(body.text, 2000);
  if (!text) return badRequest("text is required and must be 2000 characters or fewer");

  const tag = validateOptionalString(body.tag, 50) ?? "general";

  const note: Note = { id: nextId++, text, tag, timestamp: new Date().toISOString() };
  publicNotes.push(note);

  return created({ note });
}

export async function OPTIONS() {
  return preflight();
}
