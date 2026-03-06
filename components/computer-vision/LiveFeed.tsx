"use client";

import React from "react";
import { CVCard } from "@/components/ui/cv-card";
import { IconScan } from "@tabler/icons-react";

export const LiveFeed = () => {
    return (
        <CVCard className="flex flex-col gap-4 h-full" glow>
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-green-400 flex items-center gap-2">
                    <IconScan size={16} />
                    Live Detection Feed
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-[10px] font-mono text-green-400">
                    Model: YOLOv8
                </span>
            </div>

            <div className="relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden group">
                {/* Mock Video Placeholder */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 grayscale-[50%] transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=1000')" }}
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                {/* Bounding Box 1 */}
                <div className="absolute top-[20%] left-[30%] w-[15%] h-[20%] border-2 border-green-500 rounded-sm">
                    <div className="absolute -top-6 left-0 bg-green-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-t-sm">
                        Aphids 94%
                    </div>
                </div>

                {/* Bounding Box 2 */}
                <div className="absolute top-[50%] left-[60%] w-[20%] h-[25%] border-2 border-red-500 rounded-sm">
                    <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-t-sm">
                        Leaf Blight 88%
                    </div>
                </div>

                {/* HUD Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start">
                        <div className="text-[10px] font-mono text-white/50 bg-black/40 px-2 py-1 rounded">
                            CAM_ID: AS_FRONT_04<br />
                            FPS: 12.4
                        </div>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold">REC</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="text-[10px] font-mono text-white/50 bg-black/40 px-2 py-1 rounded">
                            Z: 75% | C: 92%
                        </div>
                        <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </CVCard>
    );
};
