"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import * as THREE from "three";

function ChromeWheel() {
  const groupRef = useRef<Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  const { scene } = useGLTF("/models/wheel.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.envMapIntensity !== undefined) {
          mat.envMapIntensity = 2.0;
        }
      }
    });
  }, [scene]);

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
      <group ref={groupRef} position={[2, 0, 0]} rotation={[0.3, 0, 0]}>
        <primitive object={scene} scale={0.9} />
      </group>
    </Float>
  );
}

useGLTF.preload("/models/wheel.glb");

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
