/**
 * Risk Engine
 * Implements weighted risk scoring for missions.
 */

export interface RiskFactors {
    batteryRisk: number;    // 0-1 (e.g., 0 is low risk, 1 is high risk)
    collisionRisk: number;  // 0-1
    geofenceRisk: number;   // 0-1
    gpsRisk: number;        // 0-1
}

export class RiskEngine {
    private static WEIGHTS = {
        battery: 0.4,
        collision: 0.2,
        geofence: 0.2,
        gps: 0.2,
    };

    /**
     * Calculates a normalized risk score (0-100) based on weighted factors.
     */
    public static calculateRiskScore(factors: RiskFactors): number {
        const score =
            factors.batteryRisk * this.WEIGHTS.battery +
            factors.collisionRisk * this.WEIGHTS.collision +
            factors.geofenceRisk * this.WEIGHTS.geofence +
            factors.gpsRisk * this.WEIGHTS.gps;

        // Normalize to 0-100 and round to 2 decimal places
        return Math.min(100, Math.max(0, parseFloat((score * 100).toFixed(2))));
    }

    /**
     * Determines the overall safety status based on the risk score.
     */
    public static getValidationStatus(score: number): 'SAFE' | 'WARNING' | 'UNSAFE' {
        if (score < 30) return 'SAFE';
        if (score < 70) return 'WARNING';
        return 'UNSAFE';
    }
}
