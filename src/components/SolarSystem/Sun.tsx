"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useSolarSystem, simClock } from "../../hooks/useSolarSystem";
import { getSunPosition } from "../../utils/motion";

export default function Sun() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const wakeRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/textures/sun.png");
  const { setSelectedPlanet, motionMode, forwardSpeed } = useSolarSystem();

  useFrame((state, delta) => {
    const pos = getSunPosition(simClock.time, motionMode, forwardSpeed);
    if (groupRef.current) {
      groupRef.current.position.copy(pos);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} name="SunGroup">
      {/* Sun Core */}
      <mesh 
        ref={meshRef} 
        name="Sun"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPlanet(null);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <sphereGeometry args={[8, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive={new THREE.Color("#FF5500")}
          emissiveIntensity={2.5}
          emissiveMap={texture}
        />
      </mesh>
      
      {/* Sun Glow / Corona Effect */}
      <mesh scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial
          color="#FF8C00"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Solar Wake / Golden Jet Trail in Helical Mode */}
      {motionMode === "helical" && (
        <group position={[0, 0, -40]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 7, 80, 16, 1, true]} />
          <meshBasicMaterial
            color="#FFA500"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </group>
      )}

      {/* Main Light Source */}
      <pointLight intensity={50000} distance={1500} decay={2} color="#FFFFFF" />
      <ambientLight intensity={0.15} />
    </group>
  );
}
