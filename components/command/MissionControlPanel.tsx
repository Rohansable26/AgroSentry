"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Power, Play, Pause, Home, Landmark, ShieldAlert } from "lucide-react";

export const MissionControlPanel = () => {
    const ControlButton = ({
        label,
        icon: Icon,
        variant = "default",
        className = ""
    }: {
        label: string,
        icon: any,
        variant?: "default" | "danger" | "warning" | "success",
        className?: string
    }) => (
        <button className={cn(
            "group flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 uppercase",
            variant === "default" && "bg-gray-800/10 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300",
            variant === "danger" && "bg-red-500/5 border-red-500/20 text-red-500/70 hover:bg-red-500/10 hover:border-red-500",
            variant === "warning" && "bg-yellow-500/5 border-yellow-500/20 text-yellow-500/70 hover:bg-yellow-500/10 hover:border-yellow-500",
            variant === "success" && "bg-green-500/5 border-green-500/20 text-green-500/70 hover:bg-green-500/10 hover:border-green-500",
            className
        )}>
            <Icon className="w-5 h-5 mb-2 opacity-80 group-hover:opacity-100" />
            <span className="text-[9px] font-black tracking-[0.2em]">{label}</span>
        </button>
    );

    return (
        <div className="bg-[#111521] border border-gray-800 p-6 rounded-lg flex flex-col space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Manual Overrides</h3>
                <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Link_Stable</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ControlButton label="Arm" icon={Power} variant="warning" />
                <ControlButton label="Takeoff" icon={Play} variant="success" />
                <ControlButton label="Land" icon={Pause} variant="warning" />
                <ControlButton label="Return Home" icon={Home} />
                <ControlButton label="Start Mission" icon={Landmark} variant="success" />
                <ControlButton label="Pause" icon={Pause} />

                <div className="col-span-2 flex items-center justify-center pl-4 border-l border-gray-800/50">
                    <button className="w-full max-w-[200px] aspect-square lg:aspect-auto lg:h-full bg-red-600/10 border border-red-500/30 text-red-500 rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:bg-red-600 hover:text-white group">
                        <ShieldAlert className="w-10 h-10 mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[12px] font-black uppercase tracking-[0.4em]">ESTOP</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
