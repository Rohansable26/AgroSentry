"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

const InputField = ({ label, value, onChange, unit }: { label: string; value: number; onChange: (v: number) => void; unit?: string }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full bg-slate-950/50 border border-slate-700/50 text-slate-200 text-sm px-3 py-1.5 focus:border-green-500/50 outline-none rounded transition-all focus:ring-1 focus:ring-green-500/20"
            />
            {unit && <span className="text-xs text-slate-500 font-mono">{unit}</span>}
        </div>
    </div>
);

export const SprayLogicConfig = () => {
    const [durations, setDurations] = useState({
        low: 1.0,
        medium: 3.0,
        high: 5.0,
    });

    const [altitudeRange, setAltitudeRange] = useState({
        min: 1.5,
        max: 5.0,
    });

    const [currentAltitude, setCurrentAltitude] = useState(3.2);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAltitude(a => {
                const delta = (Math.random() * 0.2 - 0.1);
                return parseFloat((a + delta).toFixed(2));
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const isSafe = currentAltitude >= altitudeRange.min && currentAltitude <= altitudeRange.max;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
        >
            {/* Severity-Based Spray Duration */}
            <section className="bg-[#1e293b]/90 border border-[#334155] rounded-lg p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                    Severity-Based Spray Duration
                </h3>
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50">
                                <th className="text-left py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Severity Level</th>
                                <th className="text-left py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration (sec)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {[
                                { label: "Low (0–49%)", key: "low" as const },
                                { label: "Medium (50–79%)", key: "medium" as const },
                                { label: "High (80–100%)", key: "high" as const },
                            ].map((row) => (
                                <tr key={row.key} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="py-3 text-sm text-slate-300 font-medium">{row.label}</td>
                                    <td className="py-2">
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={durations[row.key]}
                                            onChange={(e) => setDurations({ ...durations, [row.key]: parseFloat(e.target.value) })}
                                            className="bg-slate-950/40 border border-slate-700/50 text-slate-200 text-sm px-2 py-1 w-20 focus:border-green-500/50 outline-none rounded transition-all"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Altitude Safety Check */}
            <section className="bg-[#1e293b]/90 border border-[#334155] rounded-lg p-5 shadow-lg">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                    Altitude Safety Check
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <InputField
                        label="Min Altitude"
                        value={altitudeRange.min}
                        onChange={(v) => setAltitudeRange({ ...altitudeRange, min: v })}
                        unit="m"
                    />
                    <InputField
                        label="Max Altitude"
                        value={altitudeRange.max}
                        onChange={(v) => setAltitudeRange({ ...altitudeRange, max: v })}
                        unit="m"
                    />
                </div>
                <div className={`bg-slate-900/40 border border-slate-700/50 rounded-md p-4 flex items-center justify-between transition-all duration-500 ${isSafe ? 'ring-1 ring-green-500/10' : 'ring-1 ring-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]'}`}>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Altitude</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-mono font-bold text-slate-200 tabular-nums">{currentAltitude}</span>
                            <span className="text-xs font-mono text-slate-500 italic">m_agl</span>
                        </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${isSafe ? 'bg-green-950/30 text-green-400 border border-green-800/50' : 'bg-red-950/30 text-red-400 border border-red-800/50 animate-pulse'}`}>
                        {isSafe ? '• SAFE' : '• UNSAFE'}
                    </div>
                </div>
            </section>
        </motion.div>
    );
};
