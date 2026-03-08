"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const wireframeMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: new THREE.Color("#d1d5db"),
  transparent: true,
  opacity: 0.06,
  depthWrite: false,
});

function WireframeVolvo() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/volvo_v60_polestar_2013.glb");
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
    <group ref={groupRef} position={[0, -0.3, 0]} scale={2.2}>
      <primitive object={clonedScene} />
    </group>
  );
}

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
