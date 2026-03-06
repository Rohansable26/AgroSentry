"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export const DetectionControlBar = () => {
    const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
    const [showSegmentation, setShowSegmentation] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [confidence, setConfidence] = useState([75]);

    return (
        <div className="w-full bg-[#111521] border border-gray-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center space-x-12">
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-[0.2em]">Bounding Boxes</span>
                    <Switch checked={showBoundingBoxes} onCheckedChange={setShowBoundingBoxes} />
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-[0.2em]">Segmentation</span>
                    <Switch checked={showSegmentation} onCheckedChange={setShowSegmentation} />
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-[0.2em]">Heatmap</span>
                    <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                </label>
            </div>

            <div className="flex-1 max-w-sm flex items-center space-x-6">
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Confidence</span>
                        <span className="text-[10px] font-mono font-bold text-green-500">{confidence}%</span>
                    </div>
                    <Slider
                        value={confidence}
                        max={100}
                        step={1}
                        onValueChange={setConfidence}
                        className="cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};
