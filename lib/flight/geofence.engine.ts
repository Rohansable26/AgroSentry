/**
 * Geo-fence Engine
 * Handles polygon containment checks using the Ray Casting algorithm.
 */

export interface Point {
    lat: number;
    lng: number;
}

export type Polygon = Point[];

export class GeofenceEngine {
    /**
     * Checks if a point is inside a polygon using the Ray Casting algorithm.
     */
    public static isPointInside(point: Point, polygon: Polygon): boolean {
        if (polygon.length < 3) return false;

        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].lat, yi = polygon[i].lng;
            const xj = polygon[j].lat, yj = polygon[j].lng;

            const intersect = ((yi > point.lng) !== (yj > point.lng)) &&
                (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    }

    /**
     * Checks if all waypoints in a list are within the geofence.
     */
    public static validateWaypoints(waypoints: Point[], geofence: Polygon): boolean {
        if (!geofence || geofence.length === 0) return true; // No geofence defined
        return waypoints.every(wp => this.isPointInside(wp, geofence));
    }
}
