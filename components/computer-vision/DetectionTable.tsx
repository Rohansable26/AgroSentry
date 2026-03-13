"use client";

import React, { useEffect, useState } from "react";
import { CVCard } from "@/components/ui/cv-card";
import { IconHistory, IconEye } from "@tabler/icons-react";

interface Detection {
    id: string;
    timestamp: string;
    field: string;
    pest: string;
    confidence: number;
}

export const DetectionTable = () => {
    const [tableData, setTableData] = useState<Detection[]>([]);

    useEffect(() => {
        let active = true;
        const poll = async () => {
            try {
                const res = await fetch("/api/detection-history?limit=20", { cache: "no-store" });
                if (!res.ok) return;
                const raw = await res.json();
                if (!active || !Array.isArray(raw)) return;
                const mapped: Detection[] = raw.map((d: any, i: number) => ({
                    id: String(d.frame_id ?? i),
                    timestamp: d.timestamp
                        ? new Date(d.timestamp * 1000).toLocaleString()
                        : "—",
                    field: d.severity > 40 ? "HIGH" : d.severity > 20 ? "MED" : "LOW",
                    pest: (d.disease_class ?? "Unknown").replace(/_/g, " "),
                    confidence: Math.round((d.confidence ?? 0) * 100),
                }));
                setTableData(mapped.reverse());
            } catch { /* ignore */ }
        };
        poll();
        const id = setInterval(poll, 5000);
        return () => { active = false; clearInterval(id); };
    }, []);
    return (
        <CVCard>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-green-400 flex items-center gap-2">
                    <IconHistory size={16} />
                    Detection History
                </h3>
                <button className="text-[10px] font-bold text-gray-500 hover:text-green-400 transition-colors uppercase tracking-widest">
                    Export Data
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Field</th>
                            <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pest</th>
                            <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Confidence</th>
                            <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tableData.map((row) => (
                            <tr key={row.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 text-xs text-gray-300 font-mono">{row.timestamp}</td>
                                <td className="py-4 text-xs text-white font-medium">{row.field}</td>
                                <td className="py-4">
                                    <span className="bg-green-500/10 text-green-400 px-2.5 py-1 rounded-md text-[10px] font-bold border border-green-500/20">
                                        {row.pest}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${row.confidence}%` }} />
                                        </div>
                                        <span className="text-xs font-mono text-white/50">{row.confidence}%</span>
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <button className="text-green-400 hover:text-green-300 p-1.5 rounded-lg hover:bg-green-500/10 transition-all">
                                        <IconEye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CVCard>
    );
};
