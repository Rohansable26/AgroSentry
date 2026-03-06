"use client";
import { useState } from "react";

export default function Page() {
  const send = async () => {
    await fetch("/api/detection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cropType: "Wheat",
        pestType: "Aphids",
        district: "Pune",
        severity: 3,
      }),
    });

    alert("Inserted!");
  };

  return (
    <div>
      <button onClick={send}>Insert Test Data</button>
    </div>
  );
}
