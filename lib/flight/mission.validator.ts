import { GeofenceEngine, Point } from './geofence.engine';
import { RiskEngine } from './risk.engine';

export interface ValidationResult {
    batteryRequired: number;
    batteryAvailable: number;
    collisionRiskScore: number;
    geofenceViolation: boolean;
    validationStatus: 'SAFE' | 'WARNING' | 'UNSAFE';
    overallRiskScore: number;
}

export class MissionValidator {
    private static ALTITUDE_LIMIT = { min: 2, max: 120 }; // in meters

    /**
     * Performs pre-flight validation for a mission.
     * Mocked for MVP, but structured for real data.
     */
    public static async validateMission(
        waypoints: { lat: number; lng: number; alt: number }[],
        geofence: Point[],
        batteryLevel: number = 100
    ): Promise<ValidationResult> {
        // 1. Check altitude limits
        const altitudeViolations = waypoints.filter(
            wp => wp.alt < this.ALTITUDE_LIMIT.min || wp.alt > this.ALTITUDE_LIMIT.max
        );

        // 2. Geofence Check
        const geofenceViolation = !GeofenceEngine.validateWaypoints(
            waypoints.map(wp => ({ lat: wp.lat, lng: wp.lng })),
            geofence
        );

        // 3. Collision Risk (Simulated based on waypoint density and altitude variations)
        const collisionRiskScore = this.calculateCollisionRisk(waypoints);

        // 4. Battery Required (Dummy calculation for validator, simulator will be more precise)
        const batteryRequired = waypoints.length * 0.5; // Roughly 0.5% per waypoint

        // 5. GPS Risk (Mocked)
        const gpsRisk = 0.1;

        // 6. Calculate overall risk
        const overallRiskScore = RiskEngine.calculateRiskScore({
            batteryRisk: batteryRequired / batteryLevel,
            collisionRisk: collisionRiskScore / 100,
            geofenceRisk: geofenceViolation ? 1 : 0,
            gpsRisk: gpsRisk,
        });

        const validationStatus = RiskEngine.getValidationStatus(overallRiskScore);

        return {
            batteryRequired,
            batteryAvailable: batteryLevel,
            collisionRiskScore,
            geofenceViolation,
            validationStatus,
            overallRiskScore,
        };
    }

    private static calculateCollisionRisk(waypoints: any[]): number {
        // Simplistic risk calculation: higher density of points or low altitudes increase risk
        if (waypoints.length < 2) return 0;

        let risk = 10; // Base risk
        if (waypoints.some(wp => wp.alt < 10)) risk += 20; // Low altitude risk

        return Math.min(100, risk);
    }
}
