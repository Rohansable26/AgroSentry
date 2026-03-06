"use client";
import React, { useState } from "react";
import { motion } from "motion/react";

const InputField = ({ label, value, onChange, unit }: { label: string; value: number; onChange: (v: number) => void; unit?: string }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full bg-slate-950/40 border border-slate-700/50 text-slate-200 text-sm px-3 py-1.5 focus:border-green-500/50 outline-none rounded"
            />
            {unit && <span className="text-xs text-slate-500 font-mono">{unit}</span>}
        </div>
    </div>
);

export const PulseConfig = () => {
    const [pulse, setPulse] = useState({
        interval: 0.5,
        burst: 0.2,
        rest: 0.3,
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e293b]/90 border border-[#334155] rounded-lg p-5 flex flex-col gap-6 shadow-lg"
        >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                Pulse Spray Algorithm
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField
                    label="Pulse Interval"
                    value={pulse.interval}
                    onChange={(v) => setPulse({ ...pulse, interval: v })}
                    unit="s"
                />
                <InputField
                    label="Burst Duration"
                    value={pulse.burst}
                    onChange={(v) => setPulse({ ...pulse, burst: v })}
                    unit="s"
                />
                <InputField
                    label="Rest Duration"
                    value={pulse.rest}
                    onChange={(v) => setPulse({ ...pulse, rest: v })}
                    unit="s"
                />
            </div>

            <div className="bg-slate-950/40 border border-slate-800/50 rounded-md p-6 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.02),transparent_70%)]" />

                <div className="w-full h-12 flex items-center justify-center relative z-10">
                    <svg viewBox="0 0 400 50" className="w-full h-full stroke-slate-700 fill-none stroke-2">
                        <motion.path
                            d="M 0 40 L 50 40 L 50 10 L 100 10 L 100 40 L 150 40 L 150 10 L 200 10 L 200 40 L 250 40 L 250 10 L 300 10 L 300 40 L 350 40 L 350 10 L 400 10"
                            animate={{
                                x: [0, -50],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                        <motion.path
                            d="M 0 40 L 50 40 L 50 10 L 100 10 L 100 40 L 150 40 L 150 10 L 200 10 L 200 40 L 250 40 L 250 10 L 300 10 L 300 40 L 350 40 L 350 10 L 400 10"
                            className="stroke-green-500/40 blur-[2px]"
                            animate={{
                                x: [0, -50],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    </svg>
                </div>
                <div className="flex flex-col items-center gap-1 mt-4">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest relative z-10">
                        Live Waveform Simulation
                    </span>
                    <div className="flex gap-1.5">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                                className="w-1 h-1 rounded-full bg-green-500"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
