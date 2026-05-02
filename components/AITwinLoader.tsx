"use client";

import dynamic from "next/dynamic";

const AITwin = dynamic(() => import("./AITwin"), { ssr: false });

export default function AITwinLoader() {
  return <AITwin />;
}
