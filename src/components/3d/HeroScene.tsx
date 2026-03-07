"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import * as THREE from "three";

const gunmetalMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#4a4a50"),
  metalness: 1,
  roughness: 0.15,
  clearcoat: 0.8,
  clearcoatRoughness: 0.05,
  envMapIntensity: 2.0,
});

function ChromeWheel() {
  const groupRef = useRef<Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  const { scene } = useGLTF("/models/wheel.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = gunmetalMaterial;
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetX = (state.pointer.x * viewport.width) / 8;
    const targetY = (state.pointer.y * viewport.height) / 8;
    mouse.current.x += (targetX - mouse.current.x) * 0.03;
    mouse.current.y += (targetY - mouse.current.y) * 0.03;

    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = mouse.current.y * 0.3 + 0.3 + Math.sin(t * 0.3) * 0.15;
    groupRef.current.rotation.y = mouse.current.x * 0.3 + Math.sin(t * 0.2) * 0.2;
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
