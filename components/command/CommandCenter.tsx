"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SystemStatusBar } from "./SystemStatusBar";
import { LiveVideoViewer } from "./LiveVideoViewer";
import { TelemetryPanel } from "./TelemetryPanel";
import { SprayStatusCard } from "./SprayStatusCard";
import { MissionControlPanel } from "./MissionControlPanel";
import { AnalyticsSnapshot } from "./AnalyticsSnapshot";
import { DetectionControlBar } from "./DetectionControlBar";

export const CommandCenter = () => {
    const [telemetry, setTelemetry] = useState({
        altitude: 12.4,
        speed: 5.2,
        heading: 184,
        pitch: 2.1,
        roll: -1.4,
        yaw: 184,
        battery: 88,
        windSpeed: 3.4,
    });

    const [aiMetrics, setAiMetrics] = useState({
        fps: 0,
        latency: 0,
        status: "PAUSED" as "RUNNING" | "PAUSED" | "ERROR",
    });

    const [sprayStatus, setSprayStatus] = useState({
        mode: "AUTO" as const,
        state: "IDLE" as "ACTIVE" | "IDLE",
        pressure: 0,
        rpm: 0,
        volumeUsed: 0,
        severity: "NORMAL" as "LOW" | "NORMAL" | "HIGH" | "CRITICAL",
    });

    const [pipelineOnline, setPipelineOnline] = useState(false);
    const [detectionCount, setDetectionCount] = useState(0);

    // --- LIVE DATA from blight_detection backend ---
    const fetchLiveStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/detection-status", { cache: "no-store" });
            if (!res.ok) { setPipelineOnline(false); return; }
            const data = await res.json();

            setPipelineOnline(data.status === "RUNNING");
            setDetectionCount(data.detection_count ?? 0);

            setAiMetrics({
                fps: Math.round(data.fps ?? 0),
                latency: data.fps > 0 ? Math.round(1000 / data.fps) : 0,
                status: data.status === "RUNNING" ? "RUNNING" : data.status === "ERROR" ? "ERROR" : "PAUSED",
            });
        } catch {
            setPipelineOnline(false);
        }
    }, []);

    const fetchSprayStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/spray-stats", { cache: "no-store" });
            if (!res.ok) return;
            const data = await res.json();

            const avgSev = data.average_severity ?? 0;
            let severity: "LOW" | "NORMAL" | "HIGH" | "CRITICAL" = "NORMAL";
            if (avgSev > 60) severity = "CRITICAL";
            else if (avgSev > 40) severity = "HIGH";
            else if (avgSev > 20) severity = "NORMAL";
            else severity = "LOW";

            setSprayStatus(prev => ({
                ...prev,
                state: (data.total_sprays ?? 0) > 0 ? "ACTIVE" : "IDLE",
                volumeUsed: (data.total_sprays ?? 0) * 0.25,
                severity,
            }));
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        fetchLiveStatus();
        fetchSprayStatus();
        const id = setInterval(() => { fetchLiveStatus(); fetchSprayStatus(); }, 2000);
        return () => clearInterval(id);
    }, [fetchLiveStatus, fetchSprayStatus]);

    // Simulated telemetry (drone data still mock until MAVLink integration)
    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                ...prev,
                altitude: Math.max(0, prev.altitude + (Math.random() * 0.4 - 0.2)),
                speed: Math.max(0, prev.speed + (Math.random() * 0.2 - 0.1)),
                heading: (prev.heading + (Math.random() * 2 - 1) + 360) % 360,
                pitch: prev.pitch + (Math.random() * 0.2 - 0.1),
                roll: prev.roll + (Math.random() * 0.2 - 0.1),
                battery: Math.max(0, prev.battery - 0.01),
                windSpeed: Math.max(0, prev.windSpeed + (Math.random() * 0.4 - 0.2)),
            }));

            setSprayStatus(prev => ({
                ...prev,
                pressure: prev.state === "ACTIVE" ? 2.3 + Math.random() * 0.2 : 0,
                rpm: prev.state === "ACTIVE" ? 1200 + Math.floor(Math.random() * 200) : 0,
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#0d1117] text-gray-300 font-sans border-0 rounded-tl-2xl overflow-hidden">
            {/* 1. SYSTEM STATUS BAR (Full Width) */}
            <SystemStatusBar
                status={pipelineOnline ? "ONLINE" : "OFFLINE"}
                battery={Math.floor(telemetry.battery)}
                gpsLock={true}
                windSpeed={telemetry.windSpeed}
                flightMode="AUTO"
                missionState={pipelineOnline ? "ACTIVE" : "IDLE"}
            />

            {/* SCROLLABLE CONTENT AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                <div className="max-w-[1600px] mx-auto p-8 space-y-8">

                    {/* 2. LIVE VIDEO SECTION (Hero) */}
                    <div className="w-full">
                        <LiveVideoViewer
                            fps={aiMetrics.fps}
                            latency={aiMetrics.latency}
                            aiStatus={aiMetrics.status}
                        />
                    </div>

                    {/* 3. DETECTION CONTROL BAR */}
                    <DetectionControlBar />

                    {/* 4. THREE-COLUMN CONTROL ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <TelemetryPanel
                            altitude={telemetry.altitude}
                            speed={telemetry.speed}
                            heading={telemetry.heading}
                            pitch={telemetry.pitch}
                            roll={telemetry.roll}
                            yaw={telemetry.yaw}
                        />
                        <SprayStatusCard
                            mode={sprayStatus.mode}
                            state={sprayStatus.state}
                            pressure={sprayStatus.pressure}
                            rpm={sprayStatus.rpm}
                            volumeUsed={sprayStatus.volumeUsed}
                            severity={sprayStatus.severity}
                        />
                        <MissionControlPanel />
                    </div>

                    {/* 5. ANALYTICS SNAPSHOT */}
                    <AnalyticsSnapshot />
                    {/* FOOTER PADDING */}
                    <div className="h-4" />
                </div>
            </div>

            {/* MINIMAL FOOTER DECORATION */}
            <div className="bg-[#090c10] border-t border-gray-900 px-8 py-3 flex justify-between items-center text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                <div className="flex space-x-8">
                    <span>AGROSENTRY // SYSTEM_REV_3.2.0</span>
                    <span className="opacity-50">UPLINK_SECURE // RSA-4096</span>
                </div>
                <div className="opacity-50">
                    {new Date().toISOString()} // ALL_SYSTEMS_OPTIMAL
                </div>
            </div>
        </div>
    );
};
