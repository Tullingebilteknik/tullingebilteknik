"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/2023_volvo_xc60.glb";
const DRACO_PATH = "/draco/gltf/";

const wireframeMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: new THREE.Color("#9ca3af"),
  transparent: true,
  opacity: 0.18,
  depthWrite: false,
});

function WireframeVolvo() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const scrollY = useRef(0);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = wireframeMaterial;
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    // Bind rotation to scroll position — very subtle
    const scrollProgress = scrollY.current / (document.body.scrollHeight - window.innerHeight);
    groupRef.current.rotation.y = -0.5 + scrollProgress * 0.6;
    groupRef.current.rotation.x = 0.1;
  });

  return (
    <group ref={groupRef} position={[0.5, -0.5, 0]} scale={2.8}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH, DRACO_PATH);

export default function BlueprintCarScene() {
  return (
    <Canvas
      dpr={[1, 1]}
      camera={{ position: [5, 2, 5], fov: 30 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <WireframeVolvo />
    </Canvas>
  );
}
