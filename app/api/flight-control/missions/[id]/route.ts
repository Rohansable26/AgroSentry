import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const mission = await prisma.mission.findUnique({
            where: { id: params.id },
            include: {
                waypoints: { orderBy: { sequence: 'asc' } },
                validations: { orderBy: { createdAt: 'desc' }, take: 5 },
                simulations: { orderBy: { createdAt: 'desc' }, take: 5 }
            }
        });

        if (!mission) {
            return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
        }

        return NextResponse.json(mission);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.mission.delete({ where: { id: params.id } });
        return NextResponse.json({ message: 'Mission deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
