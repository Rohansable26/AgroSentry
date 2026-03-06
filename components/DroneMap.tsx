"use client";
import { useEffect, useRef, useState } from "react";

interface Waypoint {
    id: string;
    label: string;
    lat: number;
    lng: number;
}

function latLngToXY(
    lat: number,
    lng: number,
    bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
    width: number,
    height: number
) {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width;
    const y = height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height;
    return { x, y };
}

export default function DroneMap({ waypoints }: { waypoints: Waypoint[] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const droneIndexRef = useRef(0);
    const dronePosRef = useRef({ lat: waypoints[0]?.lat ?? 28.6139, lng: waypoints[0]?.lng ?? 77.209 });
    const [displayCoords, setDisplayCoords] = useState({ lat: 28.6139, lng: 77.209 });
    const [dimensions, setDimensions] = useState({ w: 400, h: 340 });
    const rafRef = useRef<number>(0);

    // Track container size
    useEffect(() => {
        const obs = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const r = entry.contentRect;
                setDimensions({ w: Math.floor(r.width), h: Math.floor(r.height) });
            }
        });
        if (containerRef.current) obs.observe(containerRef.current);
        return () => obs.disconnect();
    }, []);

    // Animate drone between waypoints
    useEffect(() => {
        if (waypoints.length === 0) return;
        const id = setInterval(() => {
            droneIndexRef.current = (droneIndexRef.current + 1) % waypoints.length;
            const wp = waypoints[droneIndexRef.current];
            dronePosRef.current = { lat: wp.lat, lng: wp.lng };
            setDisplayCoords({ lat: wp.lat, lng: wp.lng });
        }, 3000);
        return () => clearInterval(id);
    }, [waypoints]);

    // Render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let startTime = performance.now();

        const draw = (now: number) => {
            const ctx = canvas.getContext("2d");
            if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }

            const { w, h } = dimensions;
            canvas.width = w;
            canvas.height = h;

            if (w === 0 || h === 0) { rafRef.current = requestAnimationFrame(draw); return; }

            const allLats = waypoints.map((wp) => wp.lat);
            const allLngs = waypoints.map((wp) => wp.lng);
            const pad = 0.003;
            const bounds = {
                minLat: Math.min(...allLats) - pad,
                maxLat: Math.max(...allLats) + pad,
                minLng: Math.min(...allLngs) - pad,
                maxLng: Math.max(...allLngs) + pad,
            };

            // Dark background
            const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
            bgGrad.addColorStop(0, "#0a160a");
            bgGrad.addColorStop(1, "#030803");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            // Grid
            ctx.strokeStyle = "rgba(34,197,94,0.07)";
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < w; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y < h; y += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            // Field patches
            const fields = [
                { x: w * 0.08, y: h * 0.08, fw: w * 0.28, fh: h * 0.28, alpha: 0.06 },
                { x: w * 0.45, y: h * 0.05, fw: w * 0.38, fh: h * 0.28, alpha: 0.04 },
                { x: w * 0.12, y: h * 0.52, fw: w * 0.38, fh: h * 0.32, alpha: 0.05 },
                { x: w * 0.58, y: h * 0.48, fw: w * 0.32, fh: h * 0.38, alpha: 0.07 },
            ];
            fields.forEach((f) => {
                ctx.fillStyle = `rgba(34,197,94,${f.alpha})`;
                ctx.strokeStyle = "rgba(34,197,94,0.1)";
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.roundRect(f.x, f.y, f.fw, f.fh, 4);
                ctx.fill();
                ctx.stroke();
            });

            // Mission path polyline
            if (waypoints.length > 1) {
                ctx.setLineDash([6, 4]);
                ctx.strokeStyle = "rgba(34,197,94,0.45)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                waypoints.forEach((wp, i) => {
                    const { x, y } = latLngToXY(wp.lat, wp.lng, bounds, w, h);
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                });
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Waypoint markers
            waypoints.forEach((wp) => {
                const { x, y } = latLngToXY(wp.lat, wp.lng, bounds, w, h);
                const glow = ctx.createRadialGradient(x, y, 0, x, y, 14);
                glow.addColorStop(0, "rgba(34,197,94,0.22)");
                glow.addColorStop(1, "transparent");
                ctx.fillStyle = glow;
                ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = "rgba(0,0,0,0.85)";
                ctx.strokeStyle = "#22c55e";
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

                ctx.fillStyle = "#22c55e";
                ctx.font = "bold 8px monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(wp.label, x, y);
            });

            // Drone position
            const dpos = dronePosRef.current;
            const { x: dx, y: dy } = latLngToXY(dpos.lat, dpos.lng, bounds, w, h);

            const elapsed = now - startTime;
            const sweepAngle = (elapsed / 2000) * Math.PI * 2;

            // Radar rings
            ctx.save();
            ctx.translate(dx, dy);
            ctx.strokeStyle = "rgba(34,197,94,0.12)";
            ctx.lineWidth = 0.8;
            [16, 28, 40].forEach((r) => {
                ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
            });

            // Sweep
            ctx.fillStyle = "rgba(34,197,94,0.1)";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, 40, sweepAngle - 0.9, sweepAngle);
            ctx.closePath();
            ctx.fill();

            ctx.restore();

            // Drone glow
            const droneGlow = ctx.createRadialGradient(dx, dy, 0, dx, dy, 22);
            droneGlow.addColorStop(0, "rgba(34,197,94,0.55)");
            droneGlow.addColorStop(1, "transparent");
            ctx.fillStyle = droneGlow;
            ctx.beginPath(); ctx.arc(dx, dy, 22, 0, Math.PI * 2); ctx.fill();

            // Drone body
            ctx.save();
            ctx.translate(dx, dy);

            // Arms
            const armConfigs: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
            armConfigs.forEach(([ax, ay]) => {
                ctx.fillStyle = "#166534";
                ctx.beginPath();
                ctx.fillRect(ax * 2, ay * 2, ax * 8, ay * 8);
            });

            // Motor blobs
            [[9, 9], [-9, 9], [9, -9], [-9, -9]].forEach(([mx, my]) => {
                ctx.fillStyle = "#22c55e";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(mx, my, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Prop blur
                ctx.strokeStyle = "rgba(34,197,94,0.3)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(mx, my, 6, 2, sweepAngle * 3, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Central body
            ctx.fillStyle = "#101010";
            ctx.strokeStyle = "#22c55e";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // LED dot
            ctx.fillStyle = "#22c55e";
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // Coordinate overlay
            ctx.fillStyle = "rgba(34,197,94,0.3)";
            ctx.font = "9px monospace";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(`${dpos.lat.toFixed(5)}, ${dpos.lng.toFixed(5)}`, 8, 8);

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
    }, [waypoints, dimensions]);

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[300px]">
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
                style={{ imageRendering: "pixelated" }}
            />
            {/* Status bar */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 py-1.5 bg-black/70 backdrop-blur border-t border-green-500/15 text-[9px] font-mono text-green-400/50 pointer-events-none">
                <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse inline-block" />
                    WP {droneIndexRef.current + 1}/{waypoints.length}
                </span>
                <span>DRONE ACTIVE · AUTO</span>
                <span>{displayCoords.lat.toFixed(4)}° N</span>
            </div>
        </div>
    );
}
