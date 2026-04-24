"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AsteroidBelt({ count = 2000, innerRadius = 45, outerRadius = 55 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 2; // Slight vertical spread
      
      const scale = Math.random() * 0.1 + 0.05;
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(rotation),
        new THREE.Vector3(scale, scale, scale)
      );
      
      temp.push({ matrix, speed: (Math.random() + 0.5) * 0.02 });
    }
    return temp;
  }, [count, innerRadius, outerRadius]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate the whole belt slightly
      meshRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#888888" roughness={0.8} />
      {asteroids.map((ast, i) => {
        // Initial setup
        return null; // We set matrices in useEffect or just use setMatrixAt
      })}
    </instancedMesh>
  );
}

// Correcting the Asteroid Belt to actually set the matrices
import { useEffect } from "react";

export function AsteroidBeltCorrected({ count = 1000, innerRadius = 48, outerRadius = 58 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 1.5;
      
      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = Math.random() * 0.05 + 0.02;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, innerRadius, outerRadius, dummy]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#666666" roughness={0.9} />
    </instancedMesh>
  );
}
