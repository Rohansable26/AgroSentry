import { NextResponse } from 'next/server';
import { TelemetryEngine } from '@/lib/flight/telemetry.engine';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const missionId = searchParams.get('missionId');

    if (!missionId) {
        return NextResponse.json({ error: 'missionId is required' }, { status: 400 });
    }

    try {
        // In a real App Router environment, WebSockets are often handled via a separate server
        // or a custom server.js. For this module, we'll provide a polling fallback 
        // or a structured mock that could be connected to Socket.io.

        const mission = await prisma.mission.findUnique({
            where: { id: missionId },
            include: { waypoints: { take: 1 } }
        });

        if (!mission || mission.waypoints.length === 0) {
            return NextResponse.json({ error: 'Mission or waypoints not found' }, { status: 404 });
        }

        const telemetry = TelemetryEngine.generateMockTelemetry(missionId, mission.waypoints[0]);

        return NextResponse.json(telemetry);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
