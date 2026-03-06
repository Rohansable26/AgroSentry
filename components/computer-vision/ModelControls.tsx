"use client";

import React, { useState } from "react";
import { CVCard } from "@/components/ui/cv-card";
import {
    IconRefresh,
    IconAdjustmentsHorizontal,
    IconLayersIntersect,
    IconCpu,
    IconBolt,
    IconClock,
    IconSettings2,
    IconEye
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export const ModelControls = () => {
    const [model, setModel] = useState("YOLOv8");
    const [confidence, setConfidence] = useState(75);
    const [showBoxes, setShowBoxes] = useState(true);
    const [showMasks, setShowMasks] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);

    return (
        <CVCard className="p-0 overflow-visible border-none bg-transparent shadow-none" glow={false}>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* 🎯 Section 1: Model & Logic Configuration */}
                <div className="xl:col-span-5 flex flex-col gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-green-500/20 rounded-lg">
                            <IconSettings2 size={18} className="text-green-400" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Detection Engine</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5 px-1">
                                <IconRefresh size={12} className="text-green-500/70" />
                                Active Architecture
                            </label>
                            <div className="relative group">
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full bg-[#111827] text-slate-200 text-sm rounded-xl border border-white/10 px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all hover:bg-[#1f2937]"
                                >
                                    <option>YOLOv8 (Default)</option>
                                    <option>EfficientDet-V2</option>
                                    <option>Vision Transformer</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <IconAdjustmentsHorizontal size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center justify-between px-1">
                                <span className="flex items-center gap-1.5">
                                    <IconBolt size={12} className="text-yellow-500/70" />
                                    Sensitivity
                                </span>
                                <span className="text-green-400 font-mono text-xs">{confidence}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={confidence}
                                onChange={(e) => setConfidence(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-green-500 transition-all hover:bg-white/20"
                            />
                            <div className="flex justify-between px-1">
                                <span className="text-[8px] text-gray-600 font-bold">STRICT</span>
                                <span className="text-[8px] text-gray-600 font-bold">RELAXED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 👁️ Section 2: Visualization Layers */}
                <div className="xl:col-span-4 flex flex-col gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-blue-500/20 rounded-lg">
                            <IconEye size={18} className="text-blue-400" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Overlay Diagnostics</h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Toggle
                            label="Bounding Boxes"
                            active={showBoxes}
                            onClick={() => setShowBoxes(!showBoxes)}
                            icon={<IconLayersIntersect size={14} />}
                        />
                        <Toggle
                            label="Instance Masks"
                            active={showMasks}
                            onClick={() => setShowMasks(!showMasks)}
                            icon={<IconLayersIntersect size={14} />}
                        />
                        <Toggle
                            label="Density Heatmap"
                            active={showHeatmap}
                            onClick={() => setShowHeatmap(!showHeatmap)}
                            icon={<IconLayersIntersect size={14} />}
                        />
                    </div>
                </div>

                {/* ⚡ Section 3: System Health */}
                <div className="xl:col-span-3 flex flex-col gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-purple-500/20 rounded-lg">
                            <IconCpu size={18} className="text-purple-400" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">System Vitals</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        <StatRow icon={<IconBolt size={14} />} label="Inference" value="12.4 FPS" color="text-green-400" />
                        <StatRow icon={<IconClock size={14} />} label="Latency" value="32ms" color="text-yellow-400" />
                        <StatRow icon={<IconCpu size={14} />} label="GPU Load" value="68%" color="text-blue-400" />
                    </div>
                </div>

            </div>
        </CVCard>
    );
};

const Toggle = ({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon?: React.ReactNode }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all border shadow-lg ring-1 ring-inset",
            active
                ? "bg-green-500/10 border-green-500/50 text-green-400 ring-green-500/20"
                : "bg-[#111827] border-white/5 text-gray-500 ring-transparent hover:border-white/20 hover:text-gray-300"
        )}
    >
        {icon && <span className={cn("transition-opacity", active ? "opacity-100" : "opacity-40")}>{icon}</span>}
        {label}
    </button>
);

const StatRow = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
    <div className="flex items-center justify-between bg-black/20 border border-white/5 px-4 py-2 rounded-xl">
        <div className="flex items-center gap-3">
            <div className={cn("p-1 rounded-md bg-white/5", color)}>{icon}</div>
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-tight">{label}</span>
        </div>
        <span className={cn("text-xs font-mono font-bold", color)}>{value}</span>
    </div>
);
