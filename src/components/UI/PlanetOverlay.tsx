"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSolarSystem } from "../../hooks/useSolarSystem";
import { X, Globe, Ruler, Timer, Zap, Compass, Info as InfoIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PlanetOverlay() {
  const { selectedPlanet, setSelectedPlanet } = useSolarSystem();

  return (
    <AnimatePresence>
      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed left-0 top-0 h-full w-100 bg-black/60 backdrop-blur-2xl border-r border-white/10 z-20 overflow-y-auto no-scrollbar"
        >
          {/* Close button */}
          <button 
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>

          <div className="p-8 pt-20 flex flex-col gap-8">
            {/* Header */}
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl font-black text-white"
              >
                {selectedPlanet.name}
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "60px" }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-1 bg-linear-to-r from-blue-500 to-purple-500 mt-4"
              />
            </div>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/70 leading-relaxed text-lg"
            >
              {selectedPlanet.description}
            </motion.p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                icon={<Globe size={18} className="text-blue-400" />}
                label="Radius"
                value={`${selectedPlanet.radiusKm.toLocaleString()} km`}
                delay={0.6}
              />
              <StatCard 
                icon={<Ruler size={18} className="text-purple-400" />}
                label="Dist. from Sun"
                value={`${selectedPlanet.distanceFromSun}M km`}
                delay={0.7}
              />
              <StatCard 
                icon={<Timer size={18} className="text-green-400" />}
                label="Orbit Period"
                value={`${selectedPlanet.orbitalPeriod} Years`}
                delay={0.8}
              />
              <StatCard 
                icon={<Zap size={18} className="text-orange-400" />}
                label="Day Length"
                value={`${Math.abs(selectedPlanet.rotationPeriod)} Days`}
                delay={0.9}
              />
              <StatCard 
                icon={<Compass size={18} className="text-cyan-400" />}
                label="Axial Tilt / Inclination"
                value={`${selectedPlanet.axialTilt}°`}
                delay={1.0}
                className="col-span-2 border-cyan-500/20 bg-linear-to-r from-cyan-950/20 to-transparent"
              />
            </div>

            {/* Fun Facts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <InfoIcon size={20} className="text-blue-400" />
                Did you know?
              </h3>
              <div className="flex flex-col gap-3">
                {selectedPlanet.funFacts.map((fact, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl text-white/60 text-sm leading-relaxed">
                    {fact}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  delay,
  className 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  delay: number,
  className?: string 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={cn("bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-2 shadow-xl", className)}
    >
      <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold">
        {icon}
        {label}
      </div>
      <div className="text-white text-lg font-mono font-bold">
        {value}
      </div>
    </motion.div>
  );
}
