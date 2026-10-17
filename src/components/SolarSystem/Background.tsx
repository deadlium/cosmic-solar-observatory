"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { useSolarSystem } from "../../hooks/useSolarSystem";

export default function Background() {
  const { camera } = useThree();
  const starsGroupRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);
  const { motionMode, timeScale, isPaused } = useSolarSystem();

  // Cosmic dust streaming past in helical mode
  const dustCount = 800;
  const [dustPositions, dustSpeeds] = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    const speeds = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 600;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 600;
      speeds[i] = Math.random() * 20 + 20;
    }
    return [pos, speeds];
  }, [dustCount]);

  useFrame((state, delta) => {
    if (starsGroupRef.current) {
      starsGroupRef.current.position.copy(camera.position);
    }

    if (dustRef.current && motionMode === "helical" && !isPaused) {
      const positions = dustRef.current.geometry.attributes.position.array as Float32Array;
      const camZ = camera.position.z;
      const actualDelta = delta * timeScale;

      for (let i = 0; i < dustCount; i++) {
        positions[i * 3 + 2] -= dustSpeeds[i] * actualDelta;

        if (positions[i * 3 + 2] < camZ - 300) {
          positions[i * 3 + 2] = camZ + 300;
          positions[i * 3] = camera.position.x + (Math.random() - 0.5) * 500;
          positions[i * 3 + 1] = camera.position.y + (Math.random() - 0.5) * 350;
        }
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <group ref={starsGroupRef}>
        <Stars
          radius={300}
          depth={80}
          count={15000}
          factor={6}
          saturation={0}
          fade
          speed={0.5}
        />
      </group>

      {motionMode === "helical" && (
        <points ref={dustRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[dustPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1.5}
            color="#88CCFF"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </>
  );
}
