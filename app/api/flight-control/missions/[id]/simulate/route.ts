import { NextResponse } from 'next/server';
import { MissionService } from '@/lib/flight/mission.service';

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const result = await MissionService.simulateMission(params.id);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
