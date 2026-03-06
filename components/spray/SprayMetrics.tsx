"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

const initialData = [
    { time: "0s", volume: 0.2 },
    { time: "10s", volume: 0.8 },
    { time: "20s", volume: 1.5 },
    { time: "30s", volume: 1.2 },
    { time: "40s", volume: 1.9 },
    { time: "50s", volume: 2.4 },
    { time: "60s", volume: 2.1 },
];

const MetricCard = ({ label, value, unit, trend }: { label: string; value: string | number; unit?: string; trend?: "up" | "down" }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="w-1 h-1 bg-white rounded-full" />
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider relative z-10">{label}</span>
        <div className="flex items-baseline gap-1 mt-1 relative z-10">
            <span className="text-xl font-mono font-bold text-slate-100">{value}</span>
            {unit && <span className="text-xs font-mono text-slate-500">{unit}</span>}
        </div>
        {trend && (
            <div className={`mt-1 text-[8px] font-bold uppercase tracking-tighter ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? '▲ Fluctuating' : '▼ Stabilizing'}
            </div>
        )}
    </motion.div>
);

export const SprayMetrics = () => {
    const [volume, setVolume] = useState(42.5);
    const [efficiency, setEfficiency] = useState(94.2);

    useEffect(() => {
        const interval = setInterval(() => {
            setVolume(v => parseFloat((v + (Math.random() * 0.1 - 0.05)).toFixed(2)));
            setEfficiency(e => parseFloat((94 + (Math.random() * 0.5)).toFixed(1)));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1e293b]/90 border border-[#334155] rounded-lg p-5 flex flex-col gap-6 shadow-2xl relative"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.05),transparent_50%)] pointer-events-none" />

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 relative z-10">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                Spray Metrics & Efficiency
            </h3>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                <MetricCard label="Spray Volume" value={volume} unit="L" trend="up" />
                <MetricCard label="Coverage" value="1.2" unit="ha" />
                <MetricCard label="Efficiency" value={efficiency} unit="%" trend="up" />
                <MetricCard label="OS Reduction" value="18.5" unit="%" />
            </div>

            <div className="h-48 w-full mt-2 relative z-10 bg-slate-900/30 rounded-lg p-2 border border-slate-800/50">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={initialData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `${v}L`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '10px' }}
                            itemStyle={{ color: '#cbd5e1' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="volume"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={{ fill: '#16a34a', r: 3 }}
                            activeDot={{ r: 5, strokeWidth: 0, fill: '#4ade80' }}
                            isAnimationActive={true}
                            animationDuration={2000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
