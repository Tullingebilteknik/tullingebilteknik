"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import type { Mesh, Group } from "three";
import * as THREE from "three";

function ChromeObject() {
  const meshRef = useRef<Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;

    // Smooth lerp toward mouse position
    const targetX = (state.pointer.x * viewport.width) / 8;
    const targetY = (state.pointer.y * viewport.height) / 8;
    mouse.current.x += (targetX - mouse.current.x) * 0.03;
    mouse.current.y += (targetY - mouse.current.y) * 0.03;

    meshRef.current.rotation.x = mouse.current.y * 0.3 + state.clock.elapsedTime * 0.05;
    meshRef.current.rotation.y = mouse.current.x * 0.3 + state.clock.elapsedTime * 0.08;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.4, 256, 64, 2, 3]} />
        <meshPhysicalMaterial
          color={new THREE.Color("#c8b89a")}
          metalness={1}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.8}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Environment preset="studio" />
      <ChromeObject />
    </Canvas>
  );
}
