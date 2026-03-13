"use client";

import React, { useEffect, useState } from "react";
import { CVCard } from "@/components/ui/cv-card";
import { IconBrain, IconArrowRight } from "@tabler/icons-react";

export const AIInsights = () => {
    const [insight, setInsight] = useState("Waiting for detection data…");
    const [confidence, setConfidence] = useState(0);

    useEffect(() => {
        let active = true;
        const poll = async () => {
            try {
                const res = await fetch("/api/blight-status", { cache: "no-store" });
                if (!res.ok) return;
                const d = await res.json();
                if (!active) return;
                if (d.label && d.label !== "ModelUnavailable") {
                    const disease = (d.disease_class ?? d.label ?? "Unknown").replace(/_/g, " ");
                    const sev = d.severity ? d.severity.toFixed(1) : "?";
                    const conf = d.confidence ?? 0;
                    setConfidence(Math.round(conf * 100));
                    const action = d.should_spray
                        ? "Recommended Action: Deploy targeted drone spray mission."
                        : "Severity within acceptable range. Continue monitoring.";
                    setInsight(`Detected ${disease} with severity ${sev}%. ${action}`);
                } else {
                    setInsight("No active disease detected or model loading…");
                    setConfidence(0);
                }
            } catch {
                setInsight("Backend offline. Start the live detection server to receive AI insights.");
                setConfidence(0);
            }
        };
        poll();
        const id = setInterval(poll, 3000);
        return () => { active = false; clearInterval(id); };
    }, []);

    return (
        <CVCard className="h-full flex flex-col justify-between" glow>
            <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-green-400 flex items-center gap-2">
                    <IconBrain size={16} />
                    AI Insights
                </h3>

                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <p className="text-sm text-gray-300 leading-relaxed italic">
                        &ldquo;{insight}
                        {confidence > 0 && (
                            <> Confidence: <span className="text-green-400 font-mono font-bold">{confidence}%</span>.</>
                        )}
                        &rdquo;
                    </p>
                </div>
            </div>

            <button className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/40 py-3 rounded-xl text-green-400 text-sm font-bold transition-all group">
                Send to Flight Control
                <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </CVCard>
    );
};
