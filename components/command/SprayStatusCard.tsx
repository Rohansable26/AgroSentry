"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Droplets } from "lucide-react";

interface SprayStatusCardProps {
    mode: "AUTO" | "PULSE";
    state: "ACTIVE" | "IDLE";
    pressure: number;
    rpm: number;
    volumeUsed: number;
    severity: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
}

export const SprayStatusCard = ({
    mode,
    state,
    pressure,
    rpm,
    volumeUsed,
    severity,
}: SprayStatusCardProps) => {
    return (
        <div className="bg-[#111521] border border-gray-800 rounded-lg p-6 flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Spray Intel</h3>
                </div>
                <div className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-widest",
                    state === "ACTIVE" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-gray-800 text-gray-500 border-gray-700"
                )}>
                    {state}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-8 flex-1">
                <div className="space-y-1">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Mode</span>
                    <div className="text-sm font-black text-white uppercase">{mode}</div>
                </div>

                <div className="space-y-1">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Severity</span>
                    <div className={cn(
                        "text-sm font-black uppercase",
                        severity === "CRITICAL" ? "text-red-500" : severity === "HIGH" ? "text-orange-500" : "text-green-500"
                    )}>{severity}</div>
                </div>

                <div className="space-y-1">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Pressure</span>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-black text-white font-mono">{pressure.toFixed(1)}</span>
                        <span className="text-[9px] text-gray-600 font-mono">BAR</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Pump RPM</span>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-black text-white font-mono">{rpm}</span>
                        <span className="text-[9px] text-gray-600 font-mono">RPM</span>
                    </div>
                </div>

                <div className="col-span-2 space-y-3 pt-2 border-t border-gray-800/50">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Volume Load</span>
                        <span className="text-[10px] text-gray-400 font-mono">{volumeUsed.toFixed(2)}L / 20L</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{ width: `${(volumeUsed / 20) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
