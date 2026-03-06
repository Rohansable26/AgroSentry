"use client";

import React from "react";
import { CVCard } from "@/components/ui/cv-card";
import { IconBrain, IconArrowRight } from "@tabler/icons-react";

export const AIInsights = () => {
    return (
        <CVCard className="h-full flex flex-col justify-between" glow>
            <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-green-400 flex items-center gap-2">
                    <IconBrain size={16} />
                    AI Insights
                </h3>

                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <p className="text-sm text-gray-300 leading-relaxed italic">
                        "High aphid concentration detected in Zone 3.
                        Confidence: <span className="text-green-400 font-mono font-bold">92%</span>.
                        Recommended Action: Deploy targeted drone spray mission."
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
