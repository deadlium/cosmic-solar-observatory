"use client";

import React from "react";
import { useSolarSystem } from "../../hooks/useSolarSystem";
import { PLANETS } from "../../data/planets";
import { Play, Pause, RotateCcw, Info, Orbit, Type, RefreshCw } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function HUD() {
  const { 
    selectedPlanet, 
    setSelectedPlanet, 
    timeScale, 
    setTimeScale, 
    isPaused, 
    togglePaused,
    showLabels,
    toggleLabels,
    showOrbits,
    toggleOrbits,
    autoRotate,
    toggleAutoRotate
  } = useSolarSystem();

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Cosmic Observatory
          </h1>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">Solar System Explorer</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedPlanet(null)}
            className="bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors p-3 rounded-xl text-white shadow-xl"
            title="Reset View"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-4 items-center mb-4">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-3xl flex items-center gap-6 pointer-events-auto shadow-2xl">
          {/* Play/Pause */}
          <button 
            onClick={togglePaused}
            className="text-white hover:text-blue-400 transition-colors p-2"
          >
            {isPaused ? <Play fill="white" size={24} /> : <Pause fill="white" size={24} />}
          </button>

          {/* Time Scale */}
          <div className="flex flex-col gap-1 w-48">
            <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-tighter">
              <span>Time Scale</span>
              <span>{timeScale.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="0.1" 
              value={timeScale}
              onChange={(e) => setTimeScale(parseFloat(e.target.value))}
              className="w-full accent-blue-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Toggles */}
          <div className="flex gap-4">
            <button 
              onClick={toggleOrbits}
              className={cn("transition-colors", showOrbits ? "text-blue-400" : "text-white/40")}
              title="Toggle Orbits"
            >
              <Orbit size={20} />
            </button>
            <button 
              onClick={toggleLabels}
              className={cn("transition-colors", showLabels ? "text-blue-400" : "text-white/40")}
              title="Toggle Labels"
            >
              <Type size={20} />
            </button>
            <button 
              onClick={toggleAutoRotate}
              className={cn("transition-colors", autoRotate ? "text-blue-400" : "text-white/40")}
              title="Toggle Auto-Rotate"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Planet Quick Select */}
        <div className="flex gap-2 pointer-events-auto overflow-x-auto max-w-full pb-2 px-4 no-scrollbar">
          {PLANETS.map((planet) => (
            <button
              key={planet.name}
              onClick={() => setSelectedPlanet(planet)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap border shadow-lg",
                selectedPlanet?.name === planet.name 
                  ? "bg-white text-black border-white scale-110" 
                  : "bg-black/40 text-white border-white/10 hover:bg-white/10"
              )}
            >
              {planet.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
