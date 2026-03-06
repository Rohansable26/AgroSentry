"use client";

import React from "react";
import { CVCard } from "@/components/ui/cv-card";
import { IconHistory, IconEye } from "@tabler/icons-react";

interface Detection {
    id: string;
    timestamp: string;
    field: string;
    pest: string;
    confidence: number;
}

const tableData: Detection[] = [
    { id: "1", timestamp: "2024-05-22 14:32:10", field: "Zone 3", pest: "Aphids", confidence: 94 },
    { id: "2", timestamp: "2024-05-22 14:30:05", field: "Zone 4", pest: "Leaf Blight", confidence: 88 },
    { id: "3", timestamp: "2024-05-22 14:28:45", field: "Zone 1", pest: "Aphids", confidence: 91 },
    { id: "4", timestamp: "2024-05-22 14:25:22", field: "Zone 7", pest: "Rust", confidence: 76 },
    { id: "5", timestamp: "2024-05-22 14:20:15", field: "Zone 3", pest: "Mites", confidence: 82 },
    { id: "6", timestamp: "2024-05-22 14:15:00", field: "Zone 5", pest: "Aphids", confidence: 95 },
];

export const DetectionTable = () => {
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
