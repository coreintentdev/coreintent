"use client";

import dynamic from "next/dynamic";

const AITwin = dynamic(() => import("@/components/AITwin"), { ssr: false });

export default function AITwinLoader() {
  return <AITwin />;
}
