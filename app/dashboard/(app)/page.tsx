import React from "react";
import { DashBoardMain } from "@/components/DashBoardMain";
import { ClerkProvider } from "@clerk/nextjs";
const page = () => {
  return (
    <ClerkProvider>
      <DashBoardMain initialView="overview" />
    </ClerkProvider>
  );
};

export default page;
