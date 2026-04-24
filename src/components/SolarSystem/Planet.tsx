"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture, Html } from "@react-three/drei";
import { PlanetData } from "../../data/planets";
import { useSolarSystem } from "../../hooks/useSolarSystem";

interface PlanetProps {
  data: PlanetData;
}

export default function Planet({ data }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const texture = useTexture(data.texture);
  const { selectedPlanet, setSelectedPlanet, timeScale, isPaused, showLabels, showOrbits } = useSolarSystem();

  // Orbital motion
  useFrame((state, delta) => {
    if (isPaused) return;
    
    const actualDelta = delta * timeScale;
    
    if (orbitRef.current) {
      // Speed is inversely proportional to orbital period
      // 2 * Math.PI / period
      const speed = (2 * Math.PI) / (data.orbitalPeriod * 20); // Scaled for usability
      orbitRef.current.rotation.y += actualDelta * speed;
    }

    if (meshRef.current) {
      // Self rotation
      const rotationSpeed = (2 * Math.PI) / (Math.abs(data.rotationPeriod) * 5);
      meshRef.current.rotation.y += actualDelta * rotationSpeed * (data.rotationPeriod > 0 ? 1 : -1);
    }
  });

  const isSelected = selectedPlanet?.name === data.name;

  return (
    <group>
      {/* Orbit Path */}
      {showOrbits && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 128]} />
          <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Planet Group (Handles Orbit) */}
      <group ref={orbitRef}>
        <mesh
          ref={meshRef}
          name={data.name}
          position={[data.distance, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPlanet(data);
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
        >
          <sphereGeometry args={[data.radius, 64, 64]} />
          <meshStandardMaterial map={texture} />
          
          {/* Label */}
          {showLabels && !isSelected && (
            <Html distanceFactor={20} position={[0, data.radius + 1, 0]}>
              <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none select-none border border-white/20">
                {data.name}
              </div>
            </Html>
          )}

          {/* Saturn Rings */}
          {data.hasRings && (
            <SaturnRings radius={data.radius} />
          )}
        </mesh>
      </group>
    </group>
  );
}

function SaturnRings({ radius }: { radius: number }) {
  const ringTexture = useTexture("/textures/saturn_rings.png");
  return (
    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.5, 64]} />
      <meshStandardMaterial
        map={ringTexture}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
