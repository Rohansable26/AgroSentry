"use client";
import React from "react";
import { motion } from "motion/react";

const ControlButton = ({ label, variant = "neutral", onClick }: { label: string; variant?: "neutral" | "danger" | "success"; onClick?: () => void }) => {
    const styles = {
        neutral: "bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 border-slate-700/50 hover:border-slate-600",
        success: "bg-green-700/80 hover:bg-green-600/90 text-green-50 border-green-600/50 shadow-[0_0_15px_rgba(22,163,74,0.1)] hover:shadow-[0_0_20px_rgba(22,163,74,0.2)]",
        danger: "bg-red-700/80 hover:bg-red-600/90 text-red-50 border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.1)] hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98, y: 0 }}
            onClick={onClick}
            className={`px-6 py-2.5 rounded border text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-sm ${styles[variant]}`}
        >
            {label}
        </motion.button>
    );
};

export const SprayControls = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e293b]/80 border border-[#334155] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden backdrop-blur-md"
        >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-10" />

            <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start relative z-10">
                <ControlButton label="Arm System" variant="success" />
                <ControlButton label="Disarm System" />
                <div className="w-px h-8 bg-slate-700/50 mx-2 hidden md:block" />
                <ControlButton label="Manual Spray" />
                <ControlButton label="Pause Spray" />
                <ControlButton label="Resume Spray" />
            </div>

            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(220,38,38,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-4 bg-[#dc2626] hover:bg-red-600 text-white rounded-md border-2 border-red-800 text-sm font-black uppercase tracking-[0.4em] transition-all shadow-xl shadow-red-900/30 group z-10"
            >
                <span className="relative z-10">Emergency Stop</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div
                    className="absolute -inset-1 border border-red-500/50 rounded-lg opacity-0 group-hover:opacity-100"
                    animate={{ scale: [1, 1.05, 1], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </motion.button>
        </motion.div>
    );
};
