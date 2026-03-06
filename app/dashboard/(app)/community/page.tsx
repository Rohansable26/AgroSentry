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

export default function CommunityPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/community")
      .then((res) => res.json())
      .then((res) => {
        const formatted = res.map((item: any) => ({
          pest: item._id,
          count: item.count,
        }));
        setData(formatted);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Community Pest Trends</h1>

      {/* Chart Container */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="pest" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔴 OUTBREAK STATUS SECTION — PASTE HERE */}
      <div className="mt-6 space-y-2">
        {data.map((item) => (
          <div key={item.pest} className="flex justify-between">
            <span>{item.pest}</span>
            {item.count > 3 ? (
              <span className="text-red-500 font-semibold">
                🔴 Outbreak Risk
              </span>
            ) : (
              <span className="text-green-500">🟢 Stable</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
