"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
    blur?: number;
    glow?: boolean;
    className?: string;
    variant?: "default" | "white";
    spread?: number;
}

export const GlowingEffect = ({
    blur = 20,
    glow = true,
    className,
    variant = "default",
    spread = 1,
}: GlowingEffectProps) => {
    return (
        <div
            className={cn(
                "absolute inset-0 pointer-events-none transition-opacity duration-500",
                glow ? "opacity-100" : "opacity-0",
                className
            )}
        >
            <div
                className={cn(
                    "absolute inset-0 rounded-[inherit]",
                    variant === "default" ? "bg-green-500/20" : "bg-white/10",
                    "blur-[20px]"
                )}
                style={{
                    filter: `blur(${blur}px)`,
                    transform: `scale(${1 + spread * 0.05})`,
                }}
            />
            <div
                className={cn(
                    "absolute inset-0 rounded-[inherit] border",
                    variant === "default" ? "border-green-500/30" : "border-white/20"
                )}
            />
        </div>
    );
};
