import React from "react";
import { DashBoardMain } from "@/components/DashBoardMain";
import { ClerkProvider } from "@clerk/nextjs";

export default function ComputerVisionPage() {
    return (
        <ClerkProvider>
            <DashBoardMain initialView="computer-vision" />
        </ClerkProvider>
    );
}
