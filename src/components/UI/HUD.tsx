"use client";

import React from "react";
import { useSolarSystem } from "../../hooks/useSolarSystem";
import { PLANETS } from "../../data/planets";
import { Play, Pause, RotateCcw, Orbit, Type, RefreshCw, Sparkles, Compass } from "lucide-react";
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
    toggleAutoRotate,
    motionMode,
    toggleMotionMode,
    forwardSpeed,
    setForwardSpeed,
    resetSimulation
  } = useSolarSystem();

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col gap-2">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
              Cosmic Observatory
            </h1>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">
              Solar System Explorer
            </p>
          </div>

          {/* Motion Mode Indicator / Switcher Pill */}
          <button
            onClick={toggleMotionMode}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg transition-all w-fit bg-black/50 hover:bg-white/10 border-white/15 text-white cursor-pointer"
            title="Click to toggle Helical / Circular motion"
          >
            {motionMode === "helical" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-300 font-bold">Helical Vortex Motion</span>
                <span className="text-white/40 text-[10px] ml-1 bg-white/10 px-1.5 py-0.5 rounded">60° Galactic Tilt</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-300 font-bold">Circular Orbit Motion</span>
                <span className="text-white/40 text-[10px] ml-1 bg-white/10 px-1.5 py-0.5 rounded">Flat Plane</span>
              </>
            )}
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => {
              setSelectedPlanet(null);
            }}
            className="bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors p-3 rounded-xl text-white shadow-xl cursor-pointer"
            title="Focus Sun / Reset View"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-4 items-center mb-4">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-3xl flex items-center gap-6 pointer-events-auto shadow-2xl">
          {/* Play/Pause */}
          <button 
            onClick={togglePaused}
            className="text-white hover:text-blue-400 transition-colors p-2 cursor-pointer"
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play fill="white" size={24} /> : <Pause fill="white" size={24} />}
          </button>

          {/* Time Scale */}
          <div className="flex flex-col gap-1 w-44">
            <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-tighter">
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
              className="w-full accent-blue-500 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Forward Speed Slider in Helical Mode */}
          {motionMode === "helical" && (
            <>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col gap-1 w-36">
                <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-tighter">
                  <span className="text-cyan-300">Vortex Speed</span>
                  <span>{forwardSpeed} u/s</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="40" 
                  step="2" 
                  value={forwardSpeed}
                  onChange={(e) => setForwardSpeed(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </>
          )}

          <div className="w-px h-8 bg-white/10" />

          {/* Mode Switcher Button */}
          <button
            onClick={toggleMotionMode}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
              motionMode === "helical"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-white/5 text-white/60 border-white/10 hover:text-white"
            )}
            title="Toggle between Helical and Circular Motion"
          >
            <Sparkles size={16} />
            <span>{motionMode === "helical" ? "Helical" : "Circular"}</span>
          </button>

          {/* Toggles */}
          <div className="flex gap-4">
            <button 
              onClick={toggleOrbits}
              className={cn("transition-colors cursor-pointer", showOrbits ? "text-blue-400" : "text-white/30")}
              title="Toggle Orbits & Trails"
            >
              <Orbit size={20} />
            </button>
            <button 
              onClick={toggleLabels}
              className={cn("transition-colors cursor-pointer", showLabels ? "text-blue-400" : "text-white/30")}
              title="Toggle Labels"
            >
              <Type size={20} />
            </button>
            <button 
              onClick={toggleAutoRotate}
              className={cn("transition-colors cursor-pointer", autoRotate ? "text-blue-400" : "text-white/30")}
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
                "px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap border shadow-lg cursor-pointer",
                selectedPlanet?.name === planet.name 
                  ? "bg-white text-black border-white scale-105" 
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
