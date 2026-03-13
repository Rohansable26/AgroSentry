import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const res = await fetch("http://localhost:5001/api/status", { cache: "no-store" });
        if (!res.ok) return NextResponse.json({ status: "unavailable" }, { status: 502 });
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ status: "unavailable" }, { status: 502 });
    }
}
