"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Polygon = dynamic(
  () => import("react-leaflet").then((m) => m.Polygon),
  { ssr: false }
);

const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

type Point = {
  lat: number;
  lon: number;
};

function BoundaryDrawer({
  setBoundary,
}: {
  setBoundary: React.Dispatch<React.SetStateAction<Point[]>>;
}) {
  useMapEvents({
    click(e: any) {
      setBoundary((prev) => [
        ...prev,
        { lat: e.latlng.lat, lon: e.latlng.lng },
      ]);
    },
  });

  return null;
}

export default function MissionPlanner() {
  const [boundary, setBoundary] = useState<Point[]>([]);
  const [waypoints, setWaypoints] = useState<Point[]>([]);

  const generateMission = async () => {
    if (boundary.length < 3) {
      alert("Select at least 3 boundary points");
      return;
    }

    const res = await fetch("https://tanvipatel0211.app.n8n.cloud/webhook/8856398e-b673-4159-9c4c-4238707dbd68", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ boundary }),
    });

    const data = await res.json();
    setWaypoints(data.waypoints);
  };

  return (
    <div className="h-full w-full p-6">
      <h1 className="text-2xl font-bold text-green-500 mb-4">
        🚁 Mission Planner
      </h1>

      <div className="h-[500px] rounded-xl overflow-hidden">
        <MapContainer
          center={[19.8745, 75.3432]}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <BoundaryDrawer setBoundary={setBoundary} />

          {boundary.length > 2 && (
            <Polygon positions={boundary.map((p) => [p.lat, p.lon])} />
          )}

          {waypoints.length > 0 && (
            <Polyline positions={waypoints.map((p) => [p.lat, p.lon])} />
          )}
        </MapContainer>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={generateMission}
          className="px-6 py-2 bg-green-600 rounded-lg"
        >
          Generate Mission
        </button>

        <button
          onClick={() => {
            setBoundary([]);
            setWaypoints([]);
          }}
          className="px-6 py-2 bg-red-600 rounded-lg"
        >
          Clear
        </button>
      </div>
    </div>
  );
}