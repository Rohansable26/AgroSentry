"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LiveVideoViewerProps {
    fps: number;
    latency: number;
    aiStatus: "RUNNING" | "PAUSED" | "ERROR";
}

export const LiveVideoViewer = ({ fps, latency, aiStatus }: LiveVideoViewerProps) => {
    return (
        <div className="relative w-full aspect-video bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Header / Badges */}
            <div className="absolute top-6 left-6 z-40 flex items-center space-x-3 pointer-events-none">
                <div className="flex items-center bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 space-x-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">LIVE</span>
                </div>
                <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider">MODEL: <span className="text-green-500">YOLOv8-AGRO</span></span>
                </div>
            </div>

            <div className="absolute top-6 right-6 z-40 flex items-center space-x-3 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-gray-300 font-mono flex items-center space-x-4">
                    <span className="opacity-50">FPS: <span className="text-white opacity-100 ml-1">{fps}</span></span>
                    <span className="opacity-50">LAT: <span className="text-white opacity-100 ml-1">{latency}ms</span></span>
                    <span className="opacity-50 uppercase">AI: <span className={cn(aiStatus === "RUNNING" ? "text-green-500" : "text-red-500") + " opacity-100 ml-1"}>{aiStatus}</span></span>
                </div>
            </div>

            {/* Main Video Viewport (Mock) */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Mock Detection Overlay */}
                <div className="absolute top-[25%] left-[20%] w-[180px] h-[120px] border-2 border-[#22c55e] bg-[#22c55e]/5">
                    <div className="absolute -top-6 left-0 bg-[#22c55e] text-black text-[10px] px-2 py-0.5 font-black uppercase tracking-wider shadow-lg">PEST_TYPE_B // 98.4%</div>
                </div>

                <div className="absolute top-[50%] left-[55%] w-[140px] h-[160px] border-2 border-yellow-500/50 bg-yellow-500/5">
                    <div className="absolute -top-6 left-0 bg-yellow-500 text-black text-[10px] px-2 py-0.5 font-black uppercase tracking-wider shadow-lg">ANOMALY_032 // 82.1%</div>
                </div>

                {/* Placeholder label */}
                <div className="text-gray-900 font-black text-4xl tracking-tighter opacity-20 uppercase select-none pointer-events-none">
                    Stream_Source_01
                </div>
            </div>
        </div>
    );
};
