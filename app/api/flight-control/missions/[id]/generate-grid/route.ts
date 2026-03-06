import { NextResponse } from 'next/server';
import { MissionService } from '@/lib/flight/mission.service';
import { z } from 'zod';

const GridConfigSchema = z.object({
    rowSpacing: z.number().min(1),
    waypointSpacing: z.number().min(1),
    altitude: z.number().min(2).max(120),
    speed: z.number().min(1).max(20)
});

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const config = GridConfigSchema.parse(body);

        const waypoints = await MissionService.generateGrid(params.id, config);
        return NextResponse.json(waypoints);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
