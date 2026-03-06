"use client";

import React from "react";
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

const pestData = [
    { name: "Aphids", value: 45 },
    { name: "Blight", value: 32 },
    { name: "Rust", value: 12 },
    { name: "Mites", value: 8 },
];

const sparklineData = [
    { v: 10 }, { v: 15 }, { v: 12 }, { v: 18 }, { v: 25 }, { v: 22 }, { v: 30 }
];

export const DetectionSummary = () => {
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
                                strokeDasharray="84, 100"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-white font-mono">84%</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-green-400">OPTIMAL</span>
                        <span className="text-[10px] text-gray-500 leading-tight">Within target range for Zone 04</span>
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
                        <span className="text-2xl font-bold text-white font-mono">4.2%</span>
                        <span className="text-[10px] text-red-400 ml-2">↑ 0.8%</span>
                    </div>
                    <div className="h-8 w-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparklineData}>
                                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CVCard>
        </div>
    );
};
