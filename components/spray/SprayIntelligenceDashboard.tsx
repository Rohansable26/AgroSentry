"use client";
import React from "react";
import { motion } from "motion/react";
import { SystemStatus } from "./SystemStatus";
import { SprayLogicConfig } from "./SprayLogicConfig";
import { PulseConfig } from "./PulseConfig";
import { SprayMetrics } from "./SprayMetrics";
import { OverspraySafety } from "./OverspraySafety";
import { SprayControls } from "./SprayControls";

export const SprayIntelligenceDashboard = () => {
    return (
        <div className="flex flex-col gap-6 p-6 min-h-full bg-[#0b1120] text-[#cbd5e1] font-sans relative overflow-x-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-1 relative z-10"
            >
                <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                    Spray Intelligence & Automation
                </h1>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                            Live Link
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-l border-slate-800 pl-3">
                        Hardware Console • V1.4.2-STABLE
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 ml-auto">
                        UID: 0x4F2A_B8E1
                    </span>
                </div>
            </motion.div>

            {/* 1. System Status Panel */}
            <section className="relative z-10">
                <SystemStatus />
            </section>

            {/* 2 & 3. Main Config & Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                {/* Left Column - Logic Config */}
                <div className="flex flex-col gap-6">
                    <SprayLogicConfig />
                    <PulseConfig />
                </div>

                {/* Right Column - Metrics & Safety */}
                <div className="flex flex-col gap-6">
                    <SprayMetrics />
                    <OverspraySafety />
                </div>
            </div>

            {/* 5. Control Buttons Section */}
            <section className="relative z-10 mt-2">
                <SprayControls />
            </section>

            {/* Footer Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 flex flex-col md:flex-row items-center justify-between border-t border-slate-800/50 pt-4 gap-4 relative z-10"
            >
                <div className="flex gap-8">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">GPS Accuracy</span>
                        <span className="text-xs font-mono text-green-500/80">0.08m (OPTIMAL)</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Latency</span>
                        <span className="text-xs font-mono text-blue-400/80">12ms (FAST)</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Uptime</span>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">04:22:18</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-green-500/50"
                            animate={{ width: ["0%", "85%"] }}
                            transition={{ duration: 2, ease: "easeOut" }}
                        />
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        Secure Link Established
                    </span>
                </div>
            </motion.div>

            {/* Corner scanline overlay */}
            <div className="fixed inset-0 pointer-events-none border-[12px] border-black/5 opacity-50 select-none" />
        </div>
    );
};
