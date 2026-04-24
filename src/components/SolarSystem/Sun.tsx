"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useSolarSystem } from "../../hooks/useSolarSystem";

export default function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/textures/sun.png");
  const { setSelectedPlanet } = useSolarSystem();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
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
          emissive={new THREE.Color("#FF4500")}
          emissiveIntensity={2}
          emissiveMap={texture}
        />
      </mesh>
      
      {/* Sun Glow / Corona Effect */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial
          color="#FF8C00"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main Light Source */}
      <pointLight intensity={50000} distance={1000} decay={2} color="#FFFFFF" />
      <ambientLight intensity={0.1} />
    </group>
  );
}
