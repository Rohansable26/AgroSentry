"use client";

import React, { useState, useEffect } from "react";
import { SystemStatusBar } from "./SystemStatusBar";
import { LiveVideoViewer } from "./LiveVideoViewer";
import { TelemetryPanel } from "./TelemetryPanel";
import { SprayStatusCard } from "./SprayStatusCard";
import { MissionControlPanel } from "./MissionControlPanel";
import { AnalyticsSnapshot } from "./AnalyticsSnapshot";
import { DetectionControlBar } from "./DetectionControlBar";

export const CommandCenter = () => {
    // --- MOCK STATE ---
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
        fps: 24,
        latency: 12,
        status: "RUNNING" as const,
    });

    const [sprayStatus, setSprayStatus] = useState({
        mode: "AUTO" as const,
        state: "ACTIVE" as const,
        pressure: 2.4,
        rpm: 1280,
        volumeUsed: 4.82,
        severity: "NORMAL" as const,
    });

    // --- MOCK REAL-TIME UPDATES ---
    useEffect(() => {
        const interval = setInterval(() => {
            // Update Telemetry
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

            // Update AI Metrics
            setAiMetrics(prev => ({
                ...prev,
                fps: Math.floor(22 + Math.random() * 6),
                latency: Math.floor(10 + Math.random() * 5),
            }));

            // Update Spray Status
            setSprayStatus(prev => ({
                ...prev,
                volumeUsed: prev.state === "ACTIVE" ? prev.volumeUsed + 0.005 : prev.volumeUsed,
                pressure: prev.state === "ACTIVE" ? 2.3 + Math.random() * 0.2 : 0,
                rpm: prev.state === "ACTIVE" ? 1200 + Math.random() * 200 : 0,
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#0d1117] text-gray-300 font-sans border-0 rounded-tl-2xl overflow-hidden">
            {/* 1. SYSTEM STATUS BAR (Full Width) */}
            <SystemStatusBar
                status="ONLINE"
                battery={Math.floor(telemetry.battery)}
                gpsLock={true}
                windSpeed={telemetry.windSpeed}
                flightMode="AUTO"
                missionState="ACTIVE"
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
