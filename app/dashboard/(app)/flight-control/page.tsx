import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { FlightControlDashboard } from "@/components/FlightControlDashboard";

export default function FlightControlPage() {
    return (
        <ClerkProvider>
            <FlightControlDashboard />
        </ClerkProvider>
    );
}
