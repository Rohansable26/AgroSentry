"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SystemStatusBarProps {
    status: "ONLINE" | "OFFLINE" | "ERROR";
    battery: number;
    gpsLock: boolean;
    windSpeed: number;
    flightMode: "AUTO" | "MANUAL";
    missionState: "ACTIVE" | "IDLE";
}

export const SystemStatusBar = ({
    status,
    battery,
    gpsLock,
    windSpeed,
    flightMode,
    missionState,
}: SystemStatusBarProps) => {
    return (
        <div className="w-full bg-[#0d1117] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        status === "ONLINE" ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Drone: {status}</span>
                </div>

                <div className="flex items-center space-x-3 border-l border-gray-800 pl-8">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        gpsLock ? "bg-green-500" : "bg-gray-600"
                    )} />
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">GPS: {gpsLock ? "LOCKED" : "NO_LOCK"}</span>
                </div>

                <div className="flex items-center space-x-3 border-l border-gray-800 pl-8">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Mode</span>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">{flightMode}</span>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-4">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Battery</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full transition-all duration-500", battery > 20 ? "bg-green-500" : "bg-red-500")}
                                style={{ width: `${battery}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-gray-300 font-mono">{battery}%</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3 border-l border-gray-800 pl-8">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Wind</span>
                    <span className="text-xs font-bold text-gray-300 font-mono">{windSpeed.toFixed(1)} m/s</span>
                </div>

                <div className="flex items-center space-x-3 border-l border-gray-800 pl-8">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Mission</span>
                    <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded border",
                        missionState === "ACTIVE" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-gray-800 text-gray-500 border-gray-700"
                    )}>
                        {missionState}
                    </span>
                </div>
            </div>
        </div>
    );
};
