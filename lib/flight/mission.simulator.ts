export class MissionSimulator {
    private static AVG_SPEED = 5; // m/s
    private static BATTERY_FACTOR = 0.005; // 0.5% per 100 meters
    private static TURN_PENALTY = 2; // extra battery for sharp turns
    private static ALTITUDE_PENALTY_FACTOR = 0.1; // battery per meter of climb

    /**
     * Simulates a mission to estimate distance, duration, and battery usage.
     */
    public static simulateMission(
        waypoints: { lat: number; lng: number; alt: number; speed?: number }[]
    ) {
        if (waypoints.length < 2) {
            return {
                simulatedDistance: 0,
                simulatedDuration: 0,
                simulatedBatteryUsage: 0,
                simulationScore: 100,
            };
        }

        let totalDistance = 0;
        let totalClimb = 0;
        let turnComplexity = 0;

        for (let i = 1; i < waypoints.length; i++) {
            const p1 = waypoints[i - 1];
            const p2 = waypoints[i];

            const dist = this.haversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
            totalDistance += dist;

            if (p2.alt > p1.alt) {
                totalClimb += (p2.alt - p1.alt);
            }

            // Turn complexity simulation (simplified)
            if (i > 1) {
                turnComplexity += 1; // Assume every waypoint after the first two adds some complexity
            }
        }

        const simulatedDuration = totalDistance / this.AVG_SPEED;
        const baseBatteryUsage = (totalDistance / 100) * this.BATTERY_FACTOR * 100;
        const climbBatteryUsage = totalClimb * this.ALTITUDE_PENALTY_FACTOR;
        const turnBatteryUsage = turnComplexity * this.TURN_PENALTY;

        const simulatedBatteryUsage = Math.min(100, baseBatteryUsage + climbBatteryUsage + turnBatteryUsage);

        // Simulation score (100 - penalties)
        const simulationScore = Math.max(0, 100 - (simulatedBatteryUsage * 0.5) - (turnComplexity * 2));

        return {
            simulatedDistance: parseFloat(totalDistance.toFixed(2)),
            simulatedDuration: Math.round(simulatedDuration),
            simulatedBatteryUsage: parseFloat(simulatedBatteryUsage.toFixed(2)),
            simulationScore: parseFloat(simulationScore.toFixed(2)),
        };
    }

    /**
     * Calculates distance between two coordinates in meters.
     */
    private static haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // Earth radius in meters
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const dPhi = (lat2 - lat1) * Math.PI / 180;
        const dLambda = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}
