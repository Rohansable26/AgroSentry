import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get("limit") || "50";
        const res = await fetch(`http://localhost:5001/api/detection-history?limit=${limit}`, {
            cache: "no-store",
        });
        if (!res.ok) return NextResponse.json([], { status: 502 });
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 502 });
    }
}
