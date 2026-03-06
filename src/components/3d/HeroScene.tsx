"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import type { Group } from "three";
import * as THREE from "three";

const wheelMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#c8b89a"),
  metalness: 1,
  roughness: 0.08,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  envMapIntensity: 1.8,
});

const tireMaterial = new THREE.MeshStandardMaterial({
  color: "#1a1a1a",
  roughness: 0.9,
  metalness: 0,
});

function ChromeWheel() {
  const groupRef = useRef<Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const spokeCount = 5;
  const spokeAngles = useMemo(
    () => Array.from({ length: spokeCount }, (_, i) => (i * Math.PI * 2) / spokeCount),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetX = (state.pointer.x * viewport.width) / 8;
    const targetY = (state.pointer.y * viewport.height) / 8;
    mouse.current.x += (targetX - mouse.current.x) * 0.03;
    mouse.current.y += (targetY - mouse.current.y) * 0.03;

    groupRef.current.rotation.x = mouse.current.y * 0.3 + 0.3 + state.clock.elapsedTime * 0.05;
    groupRef.current.rotation.y = mouse.current.x * 0.3 + state.clock.elapsedTime * 0.08;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} rotation={[0.3, 0, 0]}>
        {/* Outer rim */}
        <mesh material={wheelMaterial}>
          <torusGeometry args={[1.4, 0.1, 24, 64]} />
        </mesh>

        {/* Inner rim ring */}
        <mesh material={wheelMaterial}>
          <torusGeometry args={[0.5, 0.07, 24, 64]} />
        </mesh>

        {/* Hub cap */}
        <mesh material={wheelMaterial} position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.12, 32]} />
        </mesh>

        {/* Hub cap front face */}
        <mesh material={wheelMaterial} position={[0, 0, 0.1]}>
          <circleGeometry args={[0.3, 32]} />
        </mesh>

        {/* Rim face (flat disc) */}
        <mesh material={wheelMaterial} position={[0, 0, -0.03]}>
          <ringGeometry args={[0.5, 1.4, 64]} />
        </mesh>

        {/* Spokes */}
        {spokeAngles.map((angle, i) => {
          const cx = Math.cos(angle) * 0.95;
          const cy = Math.sin(angle) * 0.95;
          return (
            <mesh
              key={i}
              material={wheelMaterial}
              position={[cx * 0.5, cy * 0.5, 0.02]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.9, 0.13, 0.06]} />
            </mesh>
          );
        })}

        {/* Outer rim depth ring (back) */}
        <mesh material={wheelMaterial} position={[0, 0, -0.08]}>
          <torusGeometry args={[1.4, 0.08, 16, 64]} />
        </mesh>

        {/* Tire rubber ring */}
        <mesh material={tireMaterial} position={[0, 0, -0.02]}>
          <torusGeometry args={[1.55, 0.18, 24, 64]} />
        </mesh>
      </group>
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
      <ChromeWheel />
    </Canvas>
  );
}
