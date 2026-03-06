import { NextResponse } from "next/server";

/**
 * In-memory store
 * (Resets when server restarts)
 */
let missionWaypoints: Record<string, any[]> = {
  "1": [
    { id: "wp-a", label: "A", lat: 28.6139, lng: 77.2090 },
    { id: "wp-b", label: "B", lat: 28.6155, lng: 77.2120 },
    { id: "wp-c", label: "C", lat: 28.6170, lng: 77.2100 },
  ],
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const missionId = params.id;
  const data = missionWaypoints[missionId] || [];
  return NextResponse.json(data);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const missionId = params.id;
  const body = await req.json();

  if (!missionWaypoints[missionId]) {
    missionWaypoints[missionId] = [];
  }

  missionWaypoints[missionId].push(body);

  return NextResponse.json({ success: true });
}