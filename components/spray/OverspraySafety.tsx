"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react";

const SafetyItem = ({ label, checked }: { label: string; checked: boolean }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-800/50 last:border-0 group">
        <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>
        <motion.div
            initial={false}
            animate={{ scale: checked ? 1 : 1.1 }}
        >
            {checked ? (
                <IconCheck className="w-4 h-4 text-green-500" strokeWidth={3} />
            ) : (
                <IconX className="w-4 h-4 text-red-500" strokeWidth={3} />
            )}
        </motion.div>
    </div>
);

export const OverspraySafety = () => {
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [flicker, setFlicker] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFlicker(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e293b]/90 border border-[#334155] rounded-lg p-5 flex flex-col gap-6 shadow-lg relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(34,197,94,0.03),transparent_50%)] pointer-events-none" />

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                Overspray Prevention Logic
            </h3>

            <div className="flex flex-col relative z-10">
                <SafetyItem label="Wind Speed < Threshold" checked={true} />
                <SafetyItem label="GPS Stability Confirmed" checked={true} />
                <SafetyItem label="Altitude Within Range" checked={true} />
                <SafetyItem label="Target Density Valid" checked={true} />
            </div>

            <div className="relative mt-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isAuthorized ? 'authorized' : 'blocked'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-md border flex flex-col items-center justify-center gap-2 transition-all duration-500 ${isAuthorized ? 'bg-green-950/20 border-green-800/40 shadow-[0_0_20px_rgba(34,197,94,0.05)]' : 'bg-red-950/20 border-red-800/40'}`}
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{
                                    boxShadow: isAuthorized ? ["0 0 0px rgba(34,197,94,0)", "0 0 10px rgba(34,197,94,0.5)", "0 0 0px rgba(34,197,94,0)"] : "none"
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-3 h-3 rounded-full ${isAuthorized ? 'bg-green-500' : 'bg-red-500'}`}
                            />
                            <span className={`text-[12px] font-black uppercase tracking-[0.25em] ${isAuthorized ? 'text-green-500' : 'text-red-500'}`}>
                                {isAuthorized ? 'Spray Authorized' : 'Spray Blocked'}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className={`w-1 h-0.5 rounded-full ${isAuthorized ? 'bg-green-900/40' : 'bg-red-900/40'}`} />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {!isAuthorized && (
                    <div className="absolute top-2 right-2 text-red-500/50">
                        <IconAlertTriangle size={14} />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-2">
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Safety Integrity Level</span>
                <span className="text-[9px] font-mono text-slate-400">SIL-3 CERTIFIED</span>
            </div>
        </motion.div>
    );
};
