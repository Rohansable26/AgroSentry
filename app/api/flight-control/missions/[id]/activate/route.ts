import { NextResponse } from 'next/server';
import { MissionService } from '@/lib/flight/mission.service';

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const mission = await MissionService.activateMission(params.id);
        return NextResponse.json(mission);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
