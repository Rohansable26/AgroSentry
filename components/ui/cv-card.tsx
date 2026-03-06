"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "./glowing-effect";

interface CVCardProps {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
}

export const CVCard = ({ children, className, glow = false }: CVCardProps) => {
    return (
        <div
            className={cn(
                "relative rounded-2xl border border-white/10 bg-[#111827]/80 backdrop-blur-xl p-6 overflow-hidden",
                className
            )}
        >
            {glow && <GlowingEffect blur={40} spread={1.2} />}
            <div className="relative z-10">{children}</div>
        </div>
    );
};
