"use client";
import React from "react";
import { motion } from "motion/react";

const StatusIndicator = ({ color, active }: { color: string; active?: boolean }) => (
    <div className="relative">
        <div
            className="w-2.5 h-2.5 rounded-full relative z-10"
            style={{ backgroundColor: color }}
        />
        {active && (
            <motion.div
                className="absolute inset-0 rounded-full z-0"
                style={{ backgroundColor: color }}
                animate={{
                    scale: [1, 2, 1],
                    opacity: [0.5, 0, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        )}
    </div>
);

const StatusItem = ({ label, value, color, active }: { label: string; value: string; color: string; active?: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-2 bg-slate-800/40 border border-slate-700/50 rounded-md backdrop-blur-sm relative overflow-hidden group"
    >
        {/* Subtle scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20" />

        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase z-10">{label}</span>
        <div className="flex items-center gap-2 z-10">
            <StatusIndicator color={color} active={active} />
            <span className="text-sm font-mono font-bold text-slate-200 group-hover:text-white transition-colors">
                {value}
            </span>
        </div>
    </motion.div>
);

export const SystemStatus = () => {
    return (
        <div className="w-full flex flex-wrap gap-4 p-4 bg-[#1e293b]/80 border border-[#334155] rounded-lg shadow-xl backdrop-blur-md">
            <StatusItem label="Spray System" value="ARMED" color="#16a34a" active={true} />
            <StatusItem label="GPIO Status" value="ACTIVE" color="#16a34a" active={true} />
            <StatusItem label="Mode" value="AUTO" color="#ca8a04" active={true} />
            <StatusItem label="Pump Status" value="RUNNING" color="#16a34a" active={true} />
        </div>
    );
};
