"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CVCard } from "@/components/ui/cv-card";
import { IconScan } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface DetectionData {
    disease_class?: string;
    confidence?: number;
    severity?: number;
    should_spray?: boolean;
    isBlight?: boolean;
    label?: string;
}

export const LiveFeed = () => {
    const [streamError, setStreamError] = useState(false);
    const [streamLoaded, setStreamLoaded] = useState(false);
    const [detection, setDetection] = useState<DetectionData>({});
    const [pipelineFps, setPipelineFps] = useState(0);

    // Poll detection + status from blight_detection backend
    useEffect(() => {
        let active = true;
        const poll = async () => {
            try {
                const [blightRes, statusRes] = await Promise.all([
                    fetch("/api/blight-status", { cache: "no-store" }),
                    fetch("/api/detection-status", { cache: "no-store" }),
                ]);
                if (blightRes.ok && active) {
                    const d = await blightRes.json();
                    setDetection(d);
                }
                if (statusRes.ok && active) {
                    const s = await statusRes.json();
                    setPipelineFps(s.fps ?? 0);
                }
            } catch { /* ignore */ }
        };
        poll();
        const id = setInterval(poll, 2500);
        return () => { active = false; clearInterval(id); };
    }, []);

    const isBlight = detection.isBlight ?? false;
    const diseaseLabel = detection.disease_class?.replace(/_/g, " ") ?? "—";
    const confidencePct = detection.confidence ? Math.round(detection.confidence * 100) : 0;
    const severityVal = detection.severity ?? 0;
    const sprayActive = detection.should_spray ?? false;

    const blightStatus = (() => {
        if (detection.label === "ModelUnavailable" || !detection.label) return "UNKNOWN";
        if (isBlight) return "BLIGHT";
        if (detection.label) return "CLEAR";
        return "NO_LEAF";
    })();

    const banner = (() => {
        switch (blightStatus) {
            case "BLIGHT":
                return { text: "⚠ BLIGHT DETECTED", color: "bg-red-600/80 border-red-400/60" };
            case "CLEAR":
                return { text: "✓ HEALTHY", color: "bg-emerald-600/80 border-emerald-400/60" };
            case "NO_LEAF":
                return { text: "NO LEAF DETECTED", color: "bg-amber-500/80 border-amber-300/60" };
            default:
                return { text: "WAITING…", color: "bg-slate-700/80 border-slate-500/60" };
        }
    })();

    // Auto-retry stream on error
    const handleStreamError = useCallback(() => {
        setStreamError(true);
        setTimeout(() => { setStreamError(false); setStreamLoaded(false); }, 5000);
    }, []);

    return (
        <CVCard className="flex flex-col gap-4 h-full" glow>
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-green-400 flex items-center gap-2">
                    <IconScan size={16} />
                    Live Detection Feed
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-500">
                        {pipelineFps.toFixed(1)} FPS
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-[10px] font-mono text-green-400">
                        YOLOv8-seg + ResNet18
                    </span>
                </div>
            </div>

            <div className="relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden group">
                {/* Real MJPEG Video Stream */}
                {!streamError ? (
                    <img
                        src="/api/video-stream"
                        alt="Live plant disease detection feed"
                        className="absolute inset-0 w-full h-full object-cover"
                        onLoad={() => setStreamLoaded(true)}
                        onError={handleStreamError}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-mono text-yellow-400">Reconnecting to stream…</span>
                        </div>
                    </div>
                )}

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                {/* HUD Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                    {/* Top row */}
                    <div className="flex justify-between items-start">
                        <div className="text-[10px] font-mono text-white/50 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                            SRC: {streamError ? "RECONNECTING" : "LIVE"}<br />
                            PIPELINE: YOLOv8 → ResNet18 → Severity
                        </div>
                        <div className="flex gap-2 items-center">
                            {!streamError && (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold">REC</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex justify-between items-end gap-4">
                        {/* Detection data card */}
                        <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/10 px-3 py-2 space-y-1 min-w-[200px]">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Disease</span>
                                <span className={cn(
                                    "text-[10px] font-bold truncate max-w-[130px]",
                                    isBlight ? "text-red-400" : "text-green-400"
                                )}>{diseaseLabel}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Conf</span>
                                <span className="text-[10px] font-mono font-bold text-white">{confidencePct}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Severity</span>
                                <span className={cn(
                                    "text-[10px] font-mono font-bold",
                                    severityVal > 40 ? "text-red-400" : severityVal > 20 ? "text-orange-400" : "text-green-400"
                                )}>{severityVal.toFixed(1)}%</span>
                            </div>
                            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-700 rounded-full",
                                        severityVal > 40 ? "bg-red-500" : severityVal > 20 ? "bg-orange-500" : "bg-green-500"
                                    )}
                                    style={{ width: `${Math.min(severityVal, 100)}%` }}
                                />
                            </div>
                            {sprayActive && (
                                <div className="flex items-center gap-1.5 pt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">SPRAY ACTIVE</span>
                                </div>
                            )}
                        </div>

                        {/* Blight status badge */}
                        <div className={cn(
                            "text-[10px] font-mono font-bold text-white px-3 py-1.5 rounded border",
                            banner.color,
                            blightStatus === "BLIGHT" && "animate-pulse"
                        )}>
                            {banner.text}
                        </div>
                    </div>
                </div>

                {/* Loading spinner while stream is connecting */}
                {!streamLoaded && !streamError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-mono text-green-400">Connecting to detection stream…</span>
                        </div>
                    </div>
                )}
            </div>
        </CVCard>
    );
};
