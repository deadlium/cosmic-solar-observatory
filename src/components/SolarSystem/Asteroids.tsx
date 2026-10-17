"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSolarSystem, simClock } from "../../hooks/useSolarSystem";
import { getSunPosition, HELICAL_CONSTANTS } from "../../utils/motion";

export function AsteroidBeltCorrected({ count = 1000, innerRadius = 48, outerRadius = 58 }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { motionMode, forwardSpeed } = useSolarSystem();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 1.8;
      
      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = Math.random() * 0.06 + 0.02;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, innerRadius, outerRadius, dummy]);

  useFrame((state, delta) => {
    const sunPos = getSunPosition(simClock.time, motionMode, forwardSpeed);
    if (groupRef.current) {
      groupRef.current.position.copy(sunPos);
      if (motionMode === "helical") {
        groupRef.current.rotation.x = -HELICAL_CONSTANTS.INCLINATION;
      } else {
        groupRef.current.rotation.x = 0;
      }
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#777777" roughness={0.85} />
      </instancedMesh>
    </group>
  );
}

export default AsteroidBeltCorrected;
