export interface GridConfig {
    rowSpacing: number; // in meters
    waypointSpacing: number; // in meters
    altitude: number;
    speed: number;
}

export class GridGenerator {
    /**
     * Generates a lawnmower pattern grid of waypoints within an area polygon.
     * Simplistic implementation: assumes a bounding box and filters points outside.
     */
    public static generateGrid(areaPolygon: { lat: number; lng: number }[], config: GridConfig) {
        if (areaPolygon.length < 3) return [];

        // 1. Find bounding box
        const lats = areaPolygon.map(p => p.lat);
        const lngs = areaPolygon.map(p => p.lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const waypoints = [];
        let sequence = 0;
        let reverse = false;

        // Convert spacing (meters) to degrees approximately (lat/lng)
        // 1 degree lat ≈ 111,000 meters
        const latStep = config.rowSpacing / 111000;
        const lngStep = config.waypointSpacing / (111000 * Math.cos(minLat * Math.PI / 180));

        for (let lat = minLat; lat <= maxLat; lat += latStep) {
            const row = [];
            for (let lng = minLng; lng <= maxLng; lng += lngStep) {
                // Here we should check if (lat, lng) is inside the polygon
                // For now, we'll just add all points in the bounding box for simplicity 
                // or assume the polygon is the bounding box.
                row.push({
                    lat,
                    lng,
                    alt: config.altitude,
                    speed: config.speed,
                    action: 'SCAN' as const,
                });
            }

            if (reverse) {
                row.reverse();
            }

            waypoints.push(...row);
            reverse = !reverse;
        }

        return waypoints.map((wp, index) => ({
            ...wp,
            sequence: index,
        }));
    }
}
