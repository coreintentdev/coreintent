import { NextRequest } from "next/server";
import { ok, badRequest, preflight, checkRateLimit, tooManyRequests, validateString } from "@/lib/api";

/**
 * /api/music — SongPal Music API
 *
 * GET  → Returns track catalog + stats
 * POST → Add tracks (from cai rip, Suno export, or manual entry)
 *
 * In-memory until a persistence layer (KV/D1) is added.
 * On Workers, isolate memory is not durable — tracks reset between cold starts.
 */

const MAX_CATALOG_SIZE = 5000;
const MAX_BATCH_SIZE = 200;

interface Track {
  id: number;
  title: string;
  artist: string;
  source: string;
  genre: string;
  duration: number;
  filename: string;
  addedAt: string;
}

const catalog: Track[] = [];
let nextId = 1;

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "default");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);

  return ok({
    tracks: catalog,
    count: catalog.length,
    sources: {
      suno: catalog.filter((t) => t.source === "suno").length,
      original: catalog.filter((t) => t.source === "original").length,
      other: catalog.filter((t) => t.source !== "suno" && t.source !== "original").length,
    },
    note: catalog.length === 0
      ? "No tracks loaded yet. Push from local CLI: cai tracks --push"
      : `${catalog.length} tracks in catalog.`,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "default");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (catalog.length >= MAX_CATALOG_SIZE) {
    return badRequest(`Catalog full (max ${MAX_CATALOG_SIZE} tracks)`);
  }

  if (Array.isArray(body.tracks)) {
    if (body.tracks.length > MAX_BATCH_SIZE) {
      return badRequest(`Batch too large (max ${MAX_BATCH_SIZE} tracks per request)`);
    }
    if (catalog.length + body.tracks.length > MAX_CATALOG_SIZE) {
      return badRequest(`Would exceed catalog limit (${MAX_CATALOG_SIZE}). Current: ${catalog.length}`);
    }

    const added: Track[] = [];
    for (const t of body.tracks) {
      if (!t || typeof t !== "object") continue;
      const raw = t as Record<string, unknown>;
      const id = nextId++;
      const track: Track = {
        id,
        title: validateString(raw.title, 200) || validateString(raw.filename, 200) || `Track ${id}`,
        artist: validateString(raw.artist, 200) || "Corey McIvor",
        source: validateString(raw.source, 50) || "suno",
        genre: validateString(raw.genre, 50) || "unknown",
        duration: typeof raw.duration === "number" && raw.duration >= 0 ? raw.duration : 0,
        filename: validateString(raw.filename, 500) || "",
        addedAt: new Date().toISOString(),
      };
      catalog.push(track);
      added.push(track);
    }
    return ok({ added: added.length, total: catalog.length });
  }

  const title = validateString(body.title, 200);
  if (!title) {
    return badRequest("title is required (max 200 chars), or send {tracks: [...]}");
  }

  const id = nextId++;
  const track: Track = {
    id,
    title,
    artist: validateString(body.artist, 200) || "Corey McIvor",
    source: validateString(body.source, 50) || "original",
    genre: validateString(body.genre, 50) || "unknown",
    duration: typeof body.duration === "number" && (body.duration as number) >= 0 ? (body.duration as number) : 0,
    filename: validateString(body.filename, 500) || "",
    addedAt: new Date().toISOString(),
  };
  catalog.push(track);

  return ok({ track, total: catalog.length });
}

export async function OPTIONS() {
  return preflight();
}
