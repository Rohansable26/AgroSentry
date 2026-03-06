"use client";

import React, { useState } from "react";
import { CVCard } from "@/components/ui/cv-card";
import { IconMap2, IconTarget } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const tabs = ["Pest Density", "Crop Stress", "Moisture Index"];

export const HeatmapPanel = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <CVCard className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-green-400 flex items-center gap-2">
                    <IconMap2 size={16} />
                    Field Stress Analysis
                </h3>

                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                                activeTab === tab
                                    ? "bg-green-500/20 text-green-400 shadow-sm"
                                    : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative w-full h-[300px] rounded-xl overflow-hidden bg-[#0d131f] border border-white/5">
                {/* Mock Heatmap Visualization */}
                <div className="absolute inset-0 opacity-40">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_30%_40%,#ef4444_20%,transparent_50%),radial-gradient(circle_at_70%_60%,#f59e0b_25%,transparent_55%),radial-gradient(circle_at_50%_50%,#22c55e_40%,transparent_70%)] blur-[40px]" />
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-lg flex flex-col gap-2">
                    <LegendItem color="bg-green-500" label="Healthy" />
                    <LegendItem color="bg-yellow-500" label="Moderate" />
                    <LegendItem color="bg-red-500" label="High Stress" />
                </div>

                {/* Selected Area HUD */}
                <div className="absolute top-4 left-4 flex items-center gap-3">
                    <div className="bg-green-500/20 text-green-400 p-2 rounded-lg border border-green-500/30">
                        <IconTarget size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none mb-1">Zone 04 Selected</span>
                        <span className="text-[10px] text-gray-500 font-mono leading-none">NDVI Index: +0.62</span>
                    </div>
                </div>
            </div>
        </CVCard>
    );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", color)} />
        <span className="text-[10px] font-medium text-gray-300">{label}</span>
    </div>
);
