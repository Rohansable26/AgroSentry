"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface LiveVideoViewerProps {
    fps: number;
    latency: number;
    aiStatus: "RUNNING" | "PAUSED" | "ERROR";
}

interface DetectionData {
    disease_class?: string;
    confidence?: number;
    severity?: number;
    should_spray?: boolean;
    isBlight?: boolean;
}

export const LiveVideoViewer = ({ fps, latency, aiStatus }: LiveVideoViewerProps) => {
    const [streamError, setStreamError] = useState(false);
    const [streamLoaded, setStreamLoaded] = useState(false);
    const [detection, setDetection] = useState<DetectionData>({});
    const [detectionCount, setDetectionCount] = useState(0);

    // Poll latest detection from blight_detection backend
    useEffect(() => {
        let active = true;
        const poll = async () => {
            try {
                const res = await fetch("/api/blight-status", { cache: "no-store" });
                if (!res.ok) return;
                const data = await res.json();
                if (active) setDetection(data);
            } catch { /* ignore */ }

            try {
                const res = await fetch("/api/detection-status", { cache: "no-store" });
                if (!res.ok) return;
                const data = await res.json();
                if (active) setDetectionCount(data.detection_count ?? 0);
            } catch { /* ignore */ }
        };
        poll();
        const id = setInterval(poll, 2000);
        return () => { active = false; clearInterval(id); };
    }, []);

    const diseaseLabel = detection.disease_class
        ? detection.disease_class.replace(/_/g, " ")
        : "—";
    const confidencePct = detection.confidence
        ? Math.round(detection.confidence * 100)
        : 0;
    const severityPct = detection.severity
        ? detection.severity.toFixed(1)
        : "0.0";
    const isBlight = detection.isBlight ?? false;
    const sprayActive = detection.should_spray ?? false;

    // Retry the stream if it fails
    const handleStreamError = useCallback(() => {
        setStreamError(true);
        // Auto-retry after 5s
        setTimeout(() => { setStreamError(false); setStreamLoaded(false); }, 5000);
    }, []);

    return (
        <div className="relative w-full aspect-video bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            {/* ── Top-left badges ── */}
            <div className="absolute top-4 left-4 z-40 flex items-center space-x-3 pointer-events-none">
                <div className="flex items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 space-x-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)]",
                        streamError ? "bg-gray-500" : "bg-red-600 animate-pulse"
                    )} />
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                        {streamError ? "RECONNECTING" : "LIVE"}
                    </span>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                        MODEL: <span className="text-green-500">YOLOv8-seg + ResNet18</span>
                    </span>
                </div>
            </div>

            {/* ── Top-right metrics ── */}
            <div className="absolute top-4 right-4 z-40 flex items-center space-x-3 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-gray-300 font-mono flex items-center space-x-4">
                    <span className="opacity-60">FPS: <span className="text-white opacity-100 ml-1">{fps}</span></span>
                    <span className="opacity-60">LAT: <span className="text-white opacity-100 ml-1">{latency}ms</span></span>
                    <span className="opacity-60">DET: <span className="text-white opacity-100 ml-1">{detectionCount}</span></span>
                    <span className="opacity-60 uppercase">AI: <span className={cn(aiStatus === "RUNNING" ? "text-green-500" : "text-red-500", "opacity-100 ml-1")}>{aiStatus}</span></span>
                </div>
            </div>

            {/* ── Bottom-left: Detection data HUD ── */}
            <div className="absolute bottom-4 left-4 z-40 pointer-events-none">
                <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/10 px-4 py-3 space-y-1.5 min-w-[220px]">
                    {/* Disease */}
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Disease</span>
                        <span className={cn(
                            "text-[11px] font-bold",
                            isBlight ? "text-red-400" : "text-green-400"
                        )}>{diseaseLabel}</span>
                    </div>
                    {/* Confidence */}
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Confidence</span>
                        <span className="text-[11px] font-mono font-bold text-white">{confidencePct}%</span>
                    </div>
                    {/* Severity */}
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Severity</span>
                        <span className={cn(
                            "text-[11px] font-mono font-bold",
                            Number(severityPct) > 40 ? "text-red-400" : Number(severityPct) > 20 ? "text-orange-400" : "text-green-400"
                        )}>{severityPct}%</span>
                    </div>
                    {/* Severity bar */}
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-700 rounded-full",
                                Number(severityPct) > 40 ? "bg-red-500" : Number(severityPct) > 20 ? "bg-orange-500" : "bg-green-500"
                            )}
                            style={{ width: `${Math.min(Number(severityPct), 100)}%` }}
                        />
                    </div>
                    {/* Spray */}
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Spray</span>
                        <span className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded border",
                            sprayActive
                                ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                                : "bg-green-500/10 text-green-500 border-green-500/20"
                        )}>
                            {sprayActive ? "SPRAYING" : "STANDBY"}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Bottom-right: Blight status badge ── */}
            <div className="absolute bottom-4 right-4 z-40 pointer-events-none">
                <div className={cn(
                    "px-4 py-2 rounded-lg border text-xs font-black uppercase tracking-widest",
                    isBlight
                        ? "bg-red-600/80 border-red-400/60 text-white animate-pulse"
                        : detection.disease_class
                            ? "bg-emerald-600/70 border-emerald-400/50 text-white"
                            : "bg-gray-700/60 border-gray-500/40 text-gray-300"
                )}>
                    {isBlight ? "⚠ BLIGHT DETECTED" : detection.disease_class ? "✓ HEALTHY" : "WAITING…"}
                </div>
            </div>

            {/* ── Main Video Viewport ── */}
            <div className="relative w-full h-full flex items-center justify-center">
                {!streamError ? (
                    <img
                        src="/api/video-stream"
                        alt="Live detection stream"
                        className="absolute inset-0 w-full h-full object-cover"
                        onLoad={() => setStreamLoaded(true)}
                        onError={handleStreamError}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-mono text-yellow-400">Reconnecting to stream…</span>
                    </div>
                )}

                {/* Loading spinner */}
                {!streamLoaded && !streamError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-mono text-green-400">Connecting to detection stream…</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
