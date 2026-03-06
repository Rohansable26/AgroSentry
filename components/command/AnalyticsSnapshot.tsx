"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
    label: string;
    value: string;
    subValue?: string;
}

const AnalyticsCard = ({ label, value, subValue }: AnalyticsCardProps) => (
    <div className="bg-[#111521] border border-gray-800 p-6 rounded-xl flex flex-col justify-between h-full">
        <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] mb-4">{label}</p>
        <div>
            <p className="text-2xl font-black text-white leading-none mb-2">{value}</p>
            {subValue && <p className="text-[10px] text-green-500/80 font-mono tracking-tighter uppercase">{subValue}</p>}
        </div>
    </div>
);

export const AnalyticsSnapshot = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <AnalyticsCard
                label="Fields Scanned"
                value="12/24"
                subValue="+2.5% vs avg"
            />
            <AnalyticsCard
                label="Pests Detected"
                value="1,482"
                subValue="YOLOv8 Active"
            />
            <AnalyticsCard
                label="Spray Volume"
                value="48.5 L"
                subValue="Remaining: 12.5L"
            />
            <AnalyticsCard
                label="Missions"
                value="8"
                subValue="Avg: 18m"
            />
            <AnalyticsCard
                label="Efficiency"
                value="98.2%"
                subValue="Target: 95%"
            />
        </div>
    );
};
