import { NextResponse } from 'next/server';
import { MissionService } from '@/lib/flight/mission.service';

import { z } from 'zod';

const CreateMissionSchema = z.object({
    name: z.string().min(3),
    droneId: z.string(),
    areaPolygon: z.object({
        points: z.array(z.object({
            lat: z.number(),
            lng: z.number()
        }))
    }).optional()
});

export async function GET() {
    try {
        const missions = await prisma.mission.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { waypoints: true } } }
        });
        return NextResponse.json(missions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = CreateMissionSchema.parse(body);

        const mission = await MissionService.createMission(validatedData);
        return NextResponse.json(mission, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
