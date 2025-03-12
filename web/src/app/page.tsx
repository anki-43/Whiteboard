"use client";

import dynamic from "next/dynamic";
import Toolbar from "./components/Toolbar";
const Canvas = dynamic(() => import("@/app/components/Canvas"), { ssr: false });

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Canvas></Canvas>
      <Toolbar></Toolbar>
    </div>
  );
}
