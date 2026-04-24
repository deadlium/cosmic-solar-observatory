"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { PLANETS } from "../../data/planets";
import Sun from "./Sun";
import Planet from "./Planet";
import Background from "./Background";
import { AsteroidBeltCorrected as AsteroidBelt } from "./Asteroids";
import { useSolarSystem } from "../../hooks/useSolarSystem";

function CameraController() {
  const { camera, controls, scene } = useThree();
  const { selectedPlanet } = useSolarSystem();
  const lastSelected = useRef<string | null>(null);

  useFrame(() => {
    if (selectedPlanet) {
      // Find the object by name in the scene
      const planetObj = scene.getObjectByName(selectedPlanet.name);
      if (planetObj && controls) {
        const worldPosition = new THREE.Vector3();
        planetObj.getWorldPosition(worldPosition);
        
        // Smoothly follow the target
        // @ts-ignore
        controls.target.lerp(worldPosition, 0.1);
      }
    }
  });

  useEffect(() => {
    if (selectedPlanet) {
      const planetObj = scene.getObjectByName(selectedPlanet.name);
      if (planetObj) {
        const worldPosition = new THREE.Vector3();
        planetObj.getWorldPosition(worldPosition);

        gsap.to(camera.position, {
          x: worldPosition.x + selectedPlanet.radius * 4,
          y: worldPosition.y + selectedPlanet.radius * 2,
          z: worldPosition.z + selectedPlanet.radius * 4,
          duration: 1.5,
          ease: "power3.inOut",
        });
      }
      lastSelected.current = selectedPlanet.name;
    } else if (lastSelected.current) {
      // Reset view to Sun
      gsap.to(camera.position, {
        x: 120,
        y: 80,
        z: 120,
        duration: 1.5,
        ease: "power3.inOut",
      });
      
      if (controls) {
        // @ts-ignore
        gsap.to(controls.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.5,
          ease: "power3.inOut",
        });
      }
      lastSelected.current = null;
    }
  }, [selectedPlanet, camera, controls]);

  return null;
}

export default function SolarSystemCanvas() {
  const { autoRotate } = useSolarSystem();

  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[120, 80, 120]} far={10000} />
          <OrbitControls 
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            enablePan={true} 
            enableZoom={true} 
            makeDefault 
            maxDistance={800}
            minDistance={10}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
          />
          
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
