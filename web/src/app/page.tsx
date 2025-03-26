"use client";

import dynamic from "next/dynamic";
import Toolbar from "./components/Toolbar";
import { Download, PencilRuler } from "lucide-react";
const Canvas = dynamic(() => import("@/app/components/Canvas"), { ssr: false });

export default function Home() {
  return (
    <div className="h-screen w-screen bg-gradient-to-tr from-gray-100 to-blue-300 flex overflow-hidden">
      <div className="m-auto h-4/5 w-4/5 bg-white border-gray-400 border-1 relative rounded-lg shadow-lg flex-col">
        <header className="flex justify-between p-4 border-gray-400 border-b-1">
          <span className="flex gap-4">
            <PencilRuler />
            <span> Simple White-Board</span>
          </span>
          <Download />
        </header>
        <div className="flex">
          <Canvas></Canvas>
          <Toolbar></Toolbar>
        </div>
      </div>
    </div>
  );
}
