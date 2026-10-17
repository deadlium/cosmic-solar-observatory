"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { PLANETS } from "../../data/planets";
import Sun from "./Sun";
import Planet from "./Planet";
import Background from "./Background";
import { AsteroidBeltCorrected as AsteroidBelt } from "./Asteroids";
import { useSolarSystem, simClock } from "../../hooks/useSolarSystem";

function SimulationTimeManager() {
  const { isPaused, timeScale } = useSolarSystem();

  useFrame((_, delta) => {
    if (!isPaused) {
      simClock.time += delta * timeScale;
    }
  });

  return null;
}

function CameraController() {
  const { camera, controls, scene } = useThree();
  const { selectedPlanet } = useSolarSystem();
  const prevTargetPos = useRef(new THREE.Vector3());
  const hasInitialized = useRef(false);

  // Smoothly glide camera on selection change
  useEffect(() => {
    let targetPos = new THREE.Vector3();
    let cameraOffset = new THREE.Vector3(140, 90, 140);

    if (selectedPlanet) {
      const planetObj = scene.getObjectByName(selectedPlanet.name);
      if (planetObj) {
        planetObj.getWorldPosition(targetPos);
        cameraOffset.set(
          selectedPlanet.radius * 4,
          selectedPlanet.radius * 2,
          selectedPlanet.radius * 4
        );
      }
    } else {
      const sunObj = scene.getObjectByName("Sun");
      if (sunObj) {
        sunObj.getWorldPosition(targetPos);
      }
    }

    gsap.to(camera.position, {
      x: targetPos.x + cameraOffset.x,
      y: targetPos.y + cameraOffset.y,
      z: targetPos.z + cameraOffset.z,
      duration: 1.2,
      ease: "power2.inOut",
    });

    if (controls) {
      // @ts-ignore
      gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.2,
        ease: "power2.inOut",
      });
    }

    prevTargetPos.current.copy(targetPos);
  }, [selectedPlanet, camera, controls, scene]);

  // Keep camera locked and traveling with the target as it corkscrews through space
  useFrame(() => {
    let targetObj: THREE.Object3D | undefined;
    if (selectedPlanet) {
      targetObj = scene.getObjectByName(selectedPlanet.name);
    } else {
      targetObj = scene.getObjectByName("Sun");
    }

    if (targetObj && controls) {
      const currentTargetPos = new THREE.Vector3();
      targetObj.getWorldPosition(currentTargetPos);

      if (hasInitialized.current) {
        const delta = currentTargetPos.clone().sub(prevTargetPos.current);
        camera.position.add(delta);
        // @ts-ignore
        controls.target.add(delta);
      } else {
        hasInitialized.current = true;
        // @ts-ignore
        controls.target.copy(currentTargetPos);
      }
      prevTargetPos.current.copy(currentTargetPos);
    }
  });

  return null;
}

export default function SolarSystemCanvas() {
  const { autoRotate } = useSolarSystem();

  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[140, 90, 140]} far={20000} />
          <OrbitControls 
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            enablePan={true} 
            enableZoom={true} 
            makeDefault 
            maxDistance={2000}
            minDistance={10}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
          />
          
          <SimulationTimeManager />
          <Background />
          <Sun />
          <AsteroidBelt />
          
          {PLANETS.map((planet) => (
            <Planet key={planet.name} data={planet} />
          ))}
          
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
