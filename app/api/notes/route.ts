import { NextResponse } from "next/server";

/**
 * /api/notes — Public customer notes (web terminal only).
 * Private notes stay on VPS at /root/.coreintent/notes/private.
 * Customers only see public notes through this endpoint.
 */

// In-memory store for demo. Replace with DB/KV when persistence layer is added.
const publicNotes: Array<{ id: number; text: string; tag: string; timestamp: string }> = [];
let nextId = 1;

export async function GET() {
  return NextResponse.json({
    notes: publicNotes,
    count: publicNotes.length,
    info: "Public notes only. Private notes are not accessible via this endpoint.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body.text?.trim();
    const tag = body.tag?.trim() || "general";

    if (!text) {
      return NextResponse.json({ error: "Note text is required" }, { status: 400 });
    }

    const note = {
      id: nextId++,
      text,
      tag,
      timestamp: new Date().toISOString(),
    };
    publicNotes.push(note);

    return NextResponse.json({ success: true, note });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
