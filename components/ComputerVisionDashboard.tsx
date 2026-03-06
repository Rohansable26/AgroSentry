"use client";

import React from "react";
import { ModelControls } from "./computer-vision/ModelControls";
import { LiveFeed } from "./computer-vision/LiveFeed";
import { DetectionSummary } from "./computer-vision/DetectionSummary";
import { HeatmapPanel } from "./computer-vision/HeatmapPanel";
import { AIInsights } from "./computer-vision/AIInsights";
import { DetectionTable } from "./computer-vision/DetectionTable";

export function ComputerVisionDashboard() {
    return (
        <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full scrollbar-hide bg-[#0b1120] text-slate-100">
            {/* 1️⃣ AI System Control Panel */}
            <section>
                <ModelControls />
            </section>

            {/* 2️⃣ Main Workspace Row */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <LiveFeed />
                </div>
                <div className="lg:col-span-4">
                    <DetectionSummary />
                </div>
            </section>

            {/* 3️⃣ Heatmap & AI Insights Row */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <HeatmapPanel />
                </div>
                <div className="lg:col-span-4">
                    <AIInsights />
                </div>
            </section>

            {/* 4️⃣ Detection History Table */}
            <section className="pb-10">
                <DetectionTable />
            </section>
        </div>
    );
}
