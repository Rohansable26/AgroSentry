import { NextResponse } from 'next/server';
import { WaypointService } from '@/lib/flight/waypoint.service';
import { z } from 'zod';

const CreateWaypointSchema = z.object({
    missionId: z.string().uuid(),
    latitude: z.number(),
    longitude: z.number(),
    altitude: z.number(),
    speed: z.number().optional(),
    action: z.enum(['SCAN', 'SPRAY', 'HOVER']).optional(),
    sequence: z.number().int().optional()
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const missionId = searchParams.get('missionId');

    if (!missionId) {
        return NextResponse.json({ error: 'missionId is required' }, { status: 400 });
    }

    try {
        const waypoints = await WaypointService.getWaypoints(missionId);
        return NextResponse.json(waypoints);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = CreateWaypointSchema.parse(body);

        const waypoint = await WaypointService.createWaypoints(validatedData.missionId, [validatedData]);
        return NextResponse.json(waypoint, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
