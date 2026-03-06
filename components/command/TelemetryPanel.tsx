"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TelemetryMetricProps {
    label: string;
    value: string | number;
    unit: string;
    trend?: "up" | "down" | "stable";
    color?: string;
}

const TelemetryMetric = ({ label, value, unit, trend, color = "text-white" }: TelemetryMetricProps) => (
    <div className="bg-[#1a1f2e] border border-gray-800 p-3 rounded-md">
        <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">{label}</span>
            {trend && (
                <span className={cn(
                    "text-[10px]",
                    trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"
                )}>
                    {trend === "up" ? "▲" : trend === "down" ? "▼" : "•"}
                </span>
            )}
        </div>
        <div className="flex items-baseline space-x-1">
            <span className={cn("text-xl font-bold font-mono tracking-tight", color)}>{value}</span>
            <span className="text-[10px] text-gray-600 font-mono uppercase">{unit}</span>
        </div>
        {/* Mock Sparkline */}
        <div className="mt-2 h-1 w-full bg-gray-900 rounded-full overflow-hidden">
            <div
                className={cn("h-full opacity-50", color.replace("text-", "bg-"))}
                style={{ width: `${Math.random() * 40 + 40}%` }}
            />
        </div>
    </div>
);

interface TelemetryPanelProps {
    altitude: number;
    speed: number;
    heading: number;
    pitch: number;
    roll: number;
    yaw: number;
}

export const TelemetryPanel = ({ altitude, speed, heading, pitch, roll, yaw }: TelemetryPanelProps) => {
    return (
        <div className="bg-[#111521] border border-gray-800 rounded-lg p-6 flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Telemetry Stream</h3>
                <span className="text-[9px] font-mono text-green-500/50 italic">REALTIME_V4</span>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-8 flex-1">
                <div className="space-y-1">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Altitude</span>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-bold text-white font-mono">{altitude.toFixed(1)}</span>
                        <span className="text-[10px] text-gray-600 font-mono">m</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Ground Speed</span>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-bold text-white font-mono">{speed.toFixed(1)}</span>
                        <span className="text-[10px] text-gray-600 font-mono">m/s</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Heading</span>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-bold text-white font-mono">{heading.toFixed(0)}</span>
                        <span className="text-[10px] text-gray-600 font-mono">°</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Vertical Spd</span>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-bold text-white font-mono">0.4</span>
                        <span className="text-[10px] text-gray-600 font-mono">m/s</span>
                    </div>
                </div>

                <div className="col-span-2 space-y-3 pt-2 border-t border-gray-800/50">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Attitude (P/R/Y)</span>
                    <div className="flex justify-between text-xs font-mono text-gray-300">
                        <span>P: {pitch.toFixed(1)}°</span>
                        <span>R: {roll.toFixed(1)}°</span>
                        <span>Y: {yaw.toFixed(1)}°</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
