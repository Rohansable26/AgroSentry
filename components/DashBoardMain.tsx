"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconDrone,
  IconCpu,
  IconMap2,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { FlightControlDashboard } from "./FlightControlDashboard";
import { IconEye } from "@tabler/icons-react";
import { ComputerVisionDashboard } from "@/components/ComputerVisionDashboard";
import { SprayIntelligenceDashboard } from "@/components/spray/SprayIntelligenceDashboard";
import { CommandCenter } from "./command/CommandCenter";
import MissionPlanner from "@/components/MissionPlanner";
export function DashBoardMain({ initialView }: { initialView?: string }) {
  const { user, isLoaded } = useUser();
  const links = [
    {
      label: "Command Center",
      onClick: () => setActiveView("overview"),
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Community Insights",
      onClick: () => setActiveView("community"),
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      onClick: () => setActiveView("profile"),
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Flight Control",
      onClick: () => setActiveView("flight-control"),
      icon: (
        <IconDrone className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Computer Vision",
      onClick: () => setActiveView("computer-vision"),
      icon: (
        <IconEye className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Spray Intelligence",
      onClick: () => setActiveView("spray-intelligence"),
      icon: (
        <IconCpu className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
   {
  label: "Mission Planner",
  onClick: () => setActiveView("mission-planner"),
  icon: (
    <IconMap2 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  ),
},
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState(initialView || "overview");

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  onClick={link.onClick}
                  className="cursor-pointer"
                >
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                // Display the user's name (or "User" while loading)
                label: isLoaded ? user?.fullName || "User" : "Loading...",
                href: "#",
                icon: (
                  // Clerk's UserButton handles the Image, Menu, Logout, and Settings automatically
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-7 w-7", // Ensures the avatar size matches your design
                      },
                    }}
                  />
                ),
              }}
              className="pb-10"
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard activeView={activeView} />
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        AgroSentry
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Dummy dashboard component with content
const Dashboard = ({ activeView }: { activeView: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [regionScore, setRegionScore] = useState(0);
  const hasCritical = data.some((item) => item.risk === "High");

  useEffect(() => {
    fetch("/api/community")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch community insights");
        return res.json();
      })
      .then((res) => {
        setData(res.analysis || []);
        setSummary(res.aiSummary || "No insights available at this time.");
        setRegionScore(res.regionScore || 0);
      })
      .catch((err) => {
        console.error("Community Fetch Error:", err);
        setSummary("The Community Intelligence Agent is currently unavailable. Please check your connection or try again later.");
      });
  }, []);

  return (
    <div className="flex flex-1">
      <div
        className={cn(
          "flex h-full w-full flex-1 flex-col rounded-tl-2xl border",
          "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900",
          activeView === "overview" ? "p-0 gap-0 overflow-hidden" : "p-6 md:p-10 gap-6 overflow-y-auto"
        )}
      >
        {activeView === "community" && (
          <>
            {hasCritical && (
              <div className="bg-red-600 text-white p-4 rounded-xl mb-4 animate-pulse">
                🚨 Autonomous AI Alert: Immediate Intervention Recommended
              </div>
            )}

            <div className="bg-black text-white p-4 rounded-xl">
              🌾 Regional Crop Health Index: {regionScore}/10
            </div>

            <div className="bg-white dark:bg-neutral-800 border border-green-200 dark:border-green-700 p-6 rounded-xl shadow-sm mb-6">
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                🧠 AI Regional Insight
              </h3>
              <div className="max-h-64 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {summary}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="pest" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="thisWeek"
                    fill="#16a34a"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-3">
              {data.map((item) => (
                <div
                  key={item.pest}
                  className="flex justify-between bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{item.pest}</p>
                    <p className="text-sm text-gray-500">
                      Growth: {item.growth}%
                    </p>
                  </div>

                  <div className="text-right">
                    <p>
                      {item.risk === "High"
                        ? "🔴 Current Risk"
                        : item.risk === "Medium"
                          ? "🟠 Watch"
                          : "🟢 Stable"}
                    </p>

                    <p className="text-xs mt-1">
                      Predicted Next Week: {item.predictedRisk}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeView === "profile" && (
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
        )}

        {activeView === "flight-control" && (
          <div className="-m-6 md:-m-10 flex-1">
            <FlightControlDashboard />
          </div>
        )}

        {activeView === "computer-vision" && (
          <div className="-m-6 md:-m-10 flex-1 h-full scrollbar-hide">
            <ComputerVisionDashboard />
          </div>
        )}

        {activeView === "spray-intelligence" && (
          <div className="-m-6 md:-m-10 flex-1 h-full">
            <SprayIntelligenceDashboard />
          </div>
        )}
         {activeView === "mission-planner" && <MissionPlanner/>}
        {activeView === "overview" && (
          <div className="flex-1 h-full">
            <CommandCenter />
          </div>
        )}
      </div>
    </div>
  );
};

