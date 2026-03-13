import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = "http://localhost:5001/latest_detection";
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ status: "unavailable" }, { status: 502 });
    }
    const text = await res.text();
    if (!text) {
      return NextResponse.json({ status: "unavailable", label: "ModelOffline" });
    }
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      console.error("Failed to parse detection JSON:", text);
      return NextResponse.json({ status: "unavailable", label: "ParseError" });
    }
  } catch (error) {
    return NextResponse.json({ status: "unavailable", label: "ConnectionError" }, { status: 502 });
  }
}
