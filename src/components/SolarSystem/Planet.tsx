"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture, Html } from "@react-three/drei";
import { PlanetData } from "../../data/planets";
import { useSolarSystem, simClock } from "../../hooks/useSolarSystem";
import {
  getPlanetPosition,
  getPlanetOrientation,
  populatePlanetTrail,
  HELICAL_CONSTANTS,
} from "../../utils/motion";

interface PlanetProps {
  data: PlanetData;
}

export default function Planet({ data }: PlanetProps) {
  const planetGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const trailLineRef = useRef<THREE.Line>(null);
  const orbitGuideRef = useRef<THREE.Line>(null);
  const texture = useTexture(data.texture);

  const {
    selectedPlanet,
    setSelectedPlanet,
    timeScale,
    isPaused,
    showLabels,
    showOrbits,
    motionMode,
    forwardSpeed,
  } = useSolarSystem();

  const baseColor = useMemo(() => new THREE.Color(data.color), [data.color]);
  const numTrailPoints = HELICAL_CONSTANTS.TRAIL_POINTS;

  // Geometry buffers for dynamic trail
  const { trailPositions, trailColors } = useMemo(() => {
    const pos = new Float32Array(numTrailPoints * 3);
    const col = new Float32Array(numTrailPoints * 3);
    return { trailPositions: pos, trailColors: col };
  }, [numTrailPoints]);

  // Extended helical orbit guide (280 points)
  const numGuidePoints = 280;
  const guidePositions = useMemo(() => new Float32Array(numGuidePoints * 3), [numGuidePoints]);

  // Initial populate
  useEffect(() => {
    populatePlanetTrail(
      trailPositions,
      trailColors,
      baseColor,
      data.distance,
      data.orbitalPeriod,
      simClock.time,
      motionMode,
      forwardSpeed,
      numTrailPoints,
      HELICAL_CONSTANTS.TRAIL_DURATION
    );
  }, [trailPositions, trailColors, baseColor, data.distance, data.orbitalPeriod, motionMode, forwardSpeed, numTrailPoints]);

  useFrame((state, delta) => {
    const t = simClock.time;
    const currentPos = getPlanetPosition(
      data.distance,
      data.orbitalPeriod,
      t,
      motionMode,
      forwardSpeed
    );

    // 1. Move planet group to current position
    if (planetGroupRef.current) {
      planetGroupRef.current.position.copy(currentPos);
    }

    // 2. Orient the tilt group (Uranus 97.77° inclination and rolling orientation)
    if (tiltGroupRef.current) {
      const q = getPlanetOrientation(
        data.orbitalPeriod,
        t,
        data.axialTilt,
        motionMode
      );
      tiltGroupRef.current.quaternion.copy(q);
    }

    // 3. Self rotation around local polar axis
    if (meshRef.current && !isPaused) {
      const actualDelta = delta * timeScale;
      const rotationSpeed = (2 * Math.PI) / (Math.abs(data.rotationPeriod) * 5);
      meshRef.current.rotation.y +=
        actualDelta * rotationSpeed * (data.rotationPeriod > 0 ? 1 : -1);
    }

    // 4. Update dynamic glowing helical trail
    if (trailLineRef.current) {
      populatePlanetTrail(
        trailPositions,
        trailColors,
        baseColor,
        data.distance,
        data.orbitalPeriod,
        t,
        motionMode,
        forwardSpeed,
        numTrailPoints,
        HELICAL_CONSTANTS.TRAIL_DURATION
      );
      const geom = trailLineRef.current.geometry;
      geom.attributes.position.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    }

    // 5. Update extended helical orbit guide when enabled
    if (showOrbits && orbitGuideRef.current) {
      if (motionMode === "helical") {
        const spanSec = 6.0;
        for (let i = 0; i < numGuidePoints; i++) {
          const sampleTime = t - spanSec * 0.5 + (i / (numGuidePoints - 1)) * spanSec;
          const p = getPlanetPosition(
            data.distance,
            data.orbitalPeriod,
            sampleTime,
            "helical",
            forwardSpeed
          );
          guidePositions[i * 3] = p.x;
          guidePositions[i * 3 + 1] = p.y;
          guidePositions[i * 3 + 2] = p.z;
        }
      } else {
        for (let i = 0; i < numGuidePoints; i++) {
          const angle = (i / (numGuidePoints - 1)) * Math.PI * 2;
          guidePositions[i * 3] = data.distance * Math.cos(angle);
          guidePositions[i * 3 + 1] = 0;
          guidePositions[i * 3 + 2] = data.distance * Math.sin(angle);
        }
      }
      orbitGuideRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const isSelected = selectedPlanet?.name === data.name;

  return (
    <group>
      {/* Dynamic Helical Trail */}
      {/* @ts-ignore */}
      <line ref={trailLineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[trailColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </line>

      {/* Orbit Guide Line (Extended Helix or Circle) */}
      {showOrbits && (
        // @ts-ignore
        <line ref={orbitGuideRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[guidePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={data.color}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </line>
      )}

      {/* Planet Group (positioned in space) */}
      <group ref={planetGroupRef}>
        {/* Tilt Group (applies 97.77° axial tilt & rolling alignment) */}
        <group ref={tiltGroupRef}>
          <mesh
            ref={meshRef}
            name={data.name}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPlanet(data);
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "default")}
          >
            <sphereGeometry args={[data.radius, 64, 64]} />
            <meshStandardMaterial map={texture} roughness={0.7} />

            {/* Saturn Rings */}
            {data.hasRings && <SaturnRings radius={data.radius} />}
          </mesh>
        </group>

        {/* Upright Label */}
        {showLabels && !isSelected && (
          <Html distanceFactor={25} position={[0, data.radius + 1.2, 0]}>
            <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap pointer-events-none select-none border border-white/20 shadow-lg">
              {data.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

function SaturnRings({ radius }: { radius: number }) {
  const ringTexture = useTexture("/textures/saturn_rings.png");
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
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
