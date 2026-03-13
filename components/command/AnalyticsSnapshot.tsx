"use client";

import React, { useEffect, useState } from "react";
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
    const [stats, setStats] = useState({
        detections: 0,
        fps: 0,
        sprays: 0,
        frames: 0,
        status: "OFFLINE",
    });

    useEffect(() => {
        let active = true;
        const poll = async () => {
            try {
                const [statusRes, sprayRes] = await Promise.all([
                    fetch("/api/detection-status", { cache: "no-store" }),
                    fetch("/api/spray-stats", { cache: "no-store" }),
                ]);
                if (!active) return;
                const statusData = statusRes.ok ? await statusRes.json() : {};
                const sprayData = sprayRes.ok ? await sprayRes.json() : {};
                setStats({
                    detections: statusData.detection_count ?? 0,
                    fps: statusData.fps ?? 0,
                    sprays: sprayData.total_sprays ?? 0,
                    frames: statusData.frame_count ?? 0,
                    status: statusData.status ?? "OFFLINE",
                });
            } catch { /* ignore */ }
        };
        poll();
        const id = setInterval(poll, 3000);
        return () => { active = false; clearInterval(id); };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <AnalyticsCard
                label="Pipeline Status"
                value={stats.status}
                subValue={stats.status === "RUNNING" ? "All systems go" : "Start server"}
            />
            <AnalyticsCard
                label="Detections"
                value={stats.detections.toLocaleString()}
                subValue="YOLOv8 + ResNet18"
            />
            <AnalyticsCard
                label="Spray Events"
                value={String(stats.sprays)}
                subValue={stats.sprays > 0 ? `~${(stats.sprays * 0.25).toFixed(1)}L used` : "No sprays yet"}
            />
            <AnalyticsCard
                label="Frames Processed"
                value={stats.frames.toLocaleString()}
                subValue={`${stats.fps.toFixed(1)} FPS`}
            />
            <AnalyticsCard
                label="Inference FPS"
                value={stats.fps.toFixed(1)}
                subValue="Real-time"
            />
        </div>
    );
};
