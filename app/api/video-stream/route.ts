import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const upstream = await fetch("http://localhost:5001/video_feed", {
            cache: "no-store",
        });

        if (!upstream.ok || !upstream.body) {
            return NextResponse.json(
                { error: "Video stream unavailable" },
                { status: 502 }
            );
        }

        // Pipe the upstream MJPEG stream straight through
        return new Response(upstream.body, {
            headers: {
                "Content-Type":
                    upstream.headers.get("Content-Type") ||
                    "multipart/x-mixed-replace; boundary=frame",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Connection: "keep-alive",
            },
        });
    } catch {
        return NextResponse.json(
            { error: "Cannot connect to video stream server" },
            { status: 502 }
        );
    }
}
