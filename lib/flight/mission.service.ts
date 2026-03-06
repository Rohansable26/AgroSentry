import { prisma } from '../prisma';
import { MissionStatus } from '@prisma/client';
import { MissionValidator } from './mission.validator';
import { MissionSimulator } from './mission.simulator';
import { WaypointService } from './waypoint.service';
import { GridGenerator, GridConfig } from './grid.generator';

export class MissionService {
    /**
     * Creates a new mission.
     */
    public static async createMission(data: { name: string; droneId: string; areaPolygon?: any }) {
        return await prisma.mission.create({
            data: {
                name: data.name,
                droneId: data.droneId,
                areaPolygon: data.areaPolygon || {},
                status: 'DRAFT',
            },
        });
    }

    /**
     * Generates a grid of waypoints for a mission based on its area polygon.
     */
    public static async generateGrid(missionId: string, config: GridConfig) {
        const mission = await prisma.mission.findUnique({
            where: { id: missionId },
        });

        if (!mission || !mission.areaPolygon) {
            throw new Error('Mission not found or no area polygon defined');
        }

        // areaPolygon is stored as Json, cast it to array of points
        const points = (mission.areaPolygon as any).points || [];
        const waypoints = GridGenerator.generateGrid(points, config);

        await WaypointService.clearWaypoints(missionId);
        await WaypointService.createWaypoints(missionId, waypoints);

        return waypoints;
    }

    /**
     * Validates a mission and stores the result.
     */
    public static async validateMission(missionId: string) {
        const mission = await prisma.mission.findUnique({
            where: { id: missionId },
            include: { waypoints: true },
        });

        if (!mission) throw new Error('Mission not found');

        const result = await MissionValidator.validateMission(
            mission.waypoints.map(wp => ({ lat: wp.latitude, lng: wp.longitude, alt: wp.altitude })),
            (mission.areaPolygon as any).points || []
        );

        await prisma.missionValidation.create({
            data: {
                missionId,
                batteryRequired: result.batteryRequired,
                batteryAvailable: result.batteryAvailable,
                collisionRiskScore: result.collisionRiskScore,
                geofenceViolation: result.geofenceViolation,
                validationStatus: result.validationStatus,
            },
        });

        await prisma.mission.update({
            where: { id: missionId },
            data: {
                riskScore: result.overallRiskScore,
                status: result.validationStatus === 'UNSAFE' ? 'DRAFT' : 'VALIDATED'
            },
        });

        return result;
    }

    /**
     * Simulates a mission and stores the result.
     */
    public static async simulateMission(missionId: string) {
        const mission = await prisma.mission.findUnique({
            where: { id: missionId },
            include: { waypoints: true },
        });

        if (!mission) throw new Error('Mission not found');

        const result = MissionSimulator.simulateMission(
            mission.waypoints.map(wp => ({
                lat: wp.latitude,
                lng: wp.longitude,
                alt: wp.altitude,
                speed: wp.speed
            }))
        );

        await prisma.missionSimulation.create({
            data: {
                missionId,
                simulatedDuration: result.simulatedDuration,
                simulatedDistance: result.simulatedDistance,
                simulatedBatteryUsage: result.simulatedBatteryUsage,
                simulationScore: result.simulationScore,
            },
        });

        await prisma.mission.update({
            where: { id: missionId },
            data: {
                estimatedDuration: result.simulatedDuration,
                estimatedBatteryUsage: result.simulatedBatteryUsage,
            },
        });

        return result;
    }

    /**
     * Activates a mission if it is validated and not unsafe.
     */
    public static async activateMission(missionId: string) {
        const mission = await prisma.mission.findUnique({
            where: { id: missionId },
        });

        if (!mission) throw new Error('Mission not found');
        if (mission.status === 'DRAFT') throw new Error('Mission must be validated before activation');

        // Check if latest validation is UNSAFE (optional extra safety check)

        return await prisma.mission.update({
            where: { id: missionId },
            data: { status: 'ACTIVE' },
        });
    }
}
