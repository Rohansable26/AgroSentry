"use client";

import React, { useEffect, useState } from "react";
import { CVCard } from "@/components/ui/cv-card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";
import { IconChartBar, IconActivity, IconPercentage } from "@tabler/icons-react";

export const DetectionSummary = () => {
    const [pestData, setPestData] = useState([
        { name: "Aphids", value: 0 },
        { name: "Blight", value: 0 },
        { name: "Rust", value: 0 },
        { name: "Healthy", value: 0 },
    ]);

    const [healthScore, setHealthScore] = useState(100);
    const [damageArea, setDamageArea] = useState(0);
    const [damageHistory, setDamageHistory] = useState([{ v: 0 }]);
    const [healthLabel, setHealthLabel] = useState("OPTIMAL");

    useEffect(() => {
        let active = true;
        const poll = async () => {
            try {
                // Fetch disease distribution
                const distRes = await fetch("/api/disease-distribution", { cache: "no-store" });
                if (distRes.ok) {
                    const dist = await distRes.json();
                    const entries = Object.entries(dist) as [string, number][];
                    if (entries.length > 0 && active) {
                        const total = entries.reduce((s, [, v]) => s + (v as number), 0);
                        const healthyCount = entries
                            .filter(([k]) => k.toLowerCase().includes("healthy"))
                            .reduce((s, [, v]) => s + (v as number), 0);
                        const diseased = total - healthyCount;

                        const mapped = entries
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .slice(0, 6)
                            .map(([name, value]) => ({
                                name: name.replace(/_/g, " ").split(" ").pop() || name,
                                value: value as number,
                            }));
                        setPestData(mapped);

                        const score = total > 0 ? Math.round((healthyCount / total) * 100) : 100;
                        setHealthScore(score);
                        setHealthLabel(score > 80 ? "OPTIMAL" : score > 50 ? "MODERATE" : "CRITICAL");
                        const dmg = total > 0 ? parseFloat(((diseased / total) * 100).toFixed(1)) : 0;
                        setDamageArea(dmg);
                        setDamageHistory(prev => [...prev.slice(-6), { v: dmg }]);
                    }
                }
            } catch { /* ignore */ }
        };
        poll();
        const id = setInterval(poll, 4000);
        return () => { active = false; clearInterval(id); };
    }, []);
    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Pest Distribution */}
            <CVCard className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                    <IconChartBar size={14} className="text-green-500" />
                    Pest Distribution
                </h3>
                <div className="h-[120px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pestData}>
                            <XAxis dataKey="name" hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", fontSize: "10px" }}
                                itemStyle={{ color: "#22c55e" }}
                            />
                            <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CVCard>

            {/* Health Score */}
            <CVCard>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                    <IconActivity size={14} className="text-green-500" />
                    Leaf Health Score
                </h3>
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                className="text-white/5"
                                strokeDasharray="100, 100"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-green-500"
                                strokeDasharray={`${healthScore}, 100`}
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-white font-mono">{healthScore}%</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xs font-bold ${healthScore > 80 ? 'text-green-400' : healthScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{healthLabel}</span>
                        <span className="text-[10px] text-gray-500 leading-tight">Live detection health index</span>
                    </div>
                </div>
            </CVCard>

            {/* Damage Area */}
            <CVCard>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-2">
                    <IconPercentage size={14} className="text-green-500" />
                    Damage Area %
                </h3>
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-2xl font-bold text-white font-mono">{damageArea}%</span>
                        <span className="text-[10px] text-red-400 ml-2">{damageArea > 0 ? '↑' : '—'}</span>
                    </div>
                    <div className="h-8 w-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={damageHistory}>
                                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CVCard>
        </div>
    );
};
