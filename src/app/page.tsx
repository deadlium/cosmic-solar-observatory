import React from "react";
import SolarSystemCanvas from "../components/SolarSystem/SolarSystemCanvas";
import HUD from "../components/UI/HUD";
import PlanetOverlay from "../components/UI/PlanetOverlay";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <SolarSystemCanvas />
      </div>

      {/* UI Layers */}
      <HUD />
      <PlanetOverlay />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-linear-to-t from-black via-transparent to-transparent opacity-50" />
    </main>
  );
}
