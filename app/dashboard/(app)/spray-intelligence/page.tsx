import React from "react";
import { DashBoardMain } from "@/components/DashBoardMain";
import { ClerkProvider } from "@clerk/nextjs";

export default function SprayIntelligencePage() {
    return (
        <ClerkProvider>
            <DashBoardMain initialView="spray-intelligence" />
        </ClerkProvider>
    );
}
