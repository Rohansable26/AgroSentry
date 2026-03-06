"use client";

import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    Polygon,
    Tooltip,
    Circle,
    useMap,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/lib/leaflet-config";
import L from "leaflet";
import "leaflet.heat";
import { useEffect, useState } from "react";

const center: [number, number] = [28.6170, 77.2100];

interface Waypoint {
    id: string;
    label: string;
    lat: number;
    lng: number;
}

/* ---------------- HEATMAP LAYER ---------------- */

function HeatmapLayer() {
    const map = useMap();

    useEffect(() => {
        const heatPoints = [
            [28.6170, 77.2100, 0.3],
            [28.6160, 77.2070, 0.7],
            [28.6180, 77.2120, 1.0],
        ];

        const heat = (L as any).heatLayer(heatPoints, {
            radius: 30,
            blur: 25,
            maxZoom: 18,
            gradient: {
                0.2: "#10B981",
                0.4: "#84cc16",
                0.6: "#f59e0b",
                0.8: "#ef4444",
            },
        });

        heat.addTo(map);

        return () => {
            map.removeLayer(heat);
        };
    }, [map]);

    return null;
}

/* ---------------- MOVING DRONE ---------------- */

function MovingDrone({ path }: { path: [number, number][] }) {
    const [position, setPosition] = useState(path[0] || center);

    useEffect(() => {
        if (!path.length) return;

        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % path.length;
            setPosition(path[i]);
        }, 1500);

        return () => clearInterval(interval);
    }, [path]);

    return <Marker position={position} />;
}

/* ---------------- CLICK HANDLER ---------------- */

function MapClickHandler({ onAddWaypoint }: { onAddWaypoint?: (lat: number, lng: number) => void | Promise<void> }) {
    useMapEvents({
        click: (e) => {
            if (onAddWaypoint) {
                onAddWaypoint(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}
/* ---------------- ADD WAYPOINT ON CLICK ---------------- */

function AddWaypointOnClick({ onAdd }: any) {
    useMapEvents({
        click(e) {
            onAdd(e.latlng.lat, e.latlng.lng);
        },
    });

    return null;
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function LiveDroneMap({
    waypoints,
    onAddWaypoint,
}: {
    waypoints: Waypoint[];
    onAddWaypoint: (lat: number, lng: number) => void | Promise<void>;
}) {
    const polylinePath: [number, number][] =
        waypoints?.map((wp) => [wp.lat, wp.lng]) || [];

    /* Simulated severity score */
    const severity = 0.65;

    const routeColor =
        severity > 0.7
            ? "#ef4444"
            : severity > 0.4
                ? "#f59e0b"
                : "#10B981";

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 min-h-[400px]">
            <MapContainer
                center={center}
                zoom={17}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                {/* 🌍 Satellite Tiles */}
                <TileLayer
                    attribution='Tiles © Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />

                {/* 🌾 Field Boundary */}
                <Polygon
                    positions={[
                        [28.6139, 77.2090],
                        [28.6155, 77.2120],
                        [28.6180, 77.2075],
                        [28.6160, 77.2055],
                    ]}
                    pathOptions={{
                        color: "#10B981",
                        weight: 2,
                        fillColor: "#10B981",
                        fillOpacity: 0.08,
                    }}
                />

                {/* 🚨 Risk Zone Highlight */}
                <Circle
                    center={[28.6165, 77.2085]}
                    radius={40}
                    pathOptions={{
                        color: "#ef4444",
                        fillColor: "#ef4444",
                        fillOpacity: 0.2,
                    }}
                />

                {/* 🔥 Spray Severity Heatmap */}
                <HeatmapLayer />

                {/* 📍 Waypoint Markers with Tooltip */}
                {waypoints.map((wp) => (
                    <Marker key={wp.id} position={[wp.lat, wp.lng]}>
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <div className="text-xs font-mono">
                                <strong>WP {wp.label}</strong>
                                <br />
                                {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
                            </div>
                        </Tooltip>
                    </Marker>
                ))}

                {/* 🛣 Severity-Based Route */}
                <Polyline
                    positions={polylinePath}
                    pathOptions={{
                        color: routeColor,
                        weight: 4,
                    }}
                />

                {/* 🚁 Animated Drone */}
                <MovingDrone path={polylinePath} />

                {/* 🖱 Click to Add Waypoint */}
                <MapClickHandler onAddWaypoint={onAddWaypoint} />
            </MapContainer>
        </div>
    );
}