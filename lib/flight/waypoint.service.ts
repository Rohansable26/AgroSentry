import { prisma } from '../prisma';
import { WaypointAction } from '@prisma/client';

export class WaypointService {
    /**
     * Creates multiple waypoints for a mission.
     */
    public static async createWaypoints(missionId: string, waypoints: any[]) {
        return await prisma.waypoint.createMany({
            data: waypoints.map((wp, index) => ({
                missionId,
                latitude: wp.lat || wp.latitude,
                longitude: wp.lng || wp.longitude,
                altitude: wp.alt || wp.altitude,
                speed: wp.speed || 5,
                action: (wp.action as WaypointAction) || 'SCAN',
                sequence: wp.sequence ?? index,
            })),
        });
    }

    /**
     * Gets all waypoints for a mission ordered by sequence.
     */
    public static async getWaypoints(missionId: string) {
        return await prisma.waypoint.findMany({
            where: { missionId },
            orderBy: { sequence: 'asc' },
        });
    }

    /**
     * Clears all waypoints for a mission.
     */
    public static async clearWaypoints(missionId: string) {
        return await prisma.waypoint.deleteMany({
            where: { missionId },
        });
    }
}
