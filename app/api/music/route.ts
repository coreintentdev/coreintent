import { NextResponse } from "next/server";

/**
 * /api/music — SongPal Music API
 *
 * GET  → Returns track catalog + stats
 * POST → Add tracks (from cai rip, Suno export, or manual entry)
 *
 * In-memory until database layer is added.
 * Accepts bulk uploads from local CLI: cai tracks --push
 */

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

export async function GET() {
  return NextResponse.json({
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (Array.isArray(body.tracks)) {
      const added: Track[] = [];
      for (const t of body.tracks) {
        const track: Track = {
          id: nextId++,
          title: t.title || t.filename || `Track ${nextId}`,
          artist: t.artist || "Corey McIvor",
          source: t.source || "suno",
          genre: t.genre || "unknown",
          duration: t.duration || 0,
          filename: t.filename || "",
          addedAt: new Date().toISOString(),
        };
        catalog.push(track);
        added.push(track);
      }
      return NextResponse.json({
        success: true,
        added: added.length,
        total: catalog.length,
      });
    }

    const title = body.title?.trim();
    if (!title) {
      return NextResponse.json({ error: "title is required (or send {tracks: [...]})" }, { status: 400 });
    }

    const track: Track = {
      id: nextId++,
      title,
      artist: body.artist || "Corey McIvor",
      source: body.source || "original",
      genre: body.genre || "unknown",
      duration: body.duration || 0,
      filename: body.filename || "",
      addedAt: new Date().toISOString(),
    };
    catalog.push(track);

    return NextResponse.json({ success: true, track, total: catalog.length });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
