"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Map service slugs to mesh name patterns
const serviceHighlightMap: Record<string, string[]> = {
  "bromsar": ["disk brake"],
  "dack-hjul": ["wheel tire", "wheel disk", "wheel metal"],
  "ac-service": ["hl front", "body chrome"],
  "service-underhall": ["body paint", "body black"],
  "felsökning-diagnostik": ["win glass", "headlight"],
  "besiktningsförberedelse": ["body paint", "body black", "hl front", "headlight"],
  "oljebyte": ["body black", "body plastic"],
  "avgassystem": ["body plastic", "body black"],
  "koppling-vaxellada": ["body black", "body plastic"],
  "elektronik-elsystem": ["win glass", "headlight", "signalglass"],
};

const ghostMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#9ca3af"),
  metalness: 0.3,
  roughness: 0.6,
  transparent: true,
  opacity: 0.08,
  depthWrite: false,
});

const goldHighlight = new THREE.Color("#c9a84c");

interface VolvoModelProps {
  activeSlug: string | null;
}

function VolvoModel({ activeSlug }: VolvoModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/volvo_v60_polestar_2013.glb");
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Store original materials and create per-mesh highlight materials
  const meshData = useMemo(() => {
    const data: { mesh: THREE.Mesh; ghost: THREE.MeshPhysicalMaterial; highlight: THREE.MeshPhysicalMaterial }[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const ghost = ghostMaterial.clone();
        const highlight = new THREE.MeshPhysicalMaterial({
          color: goldHighlight,
          metalness: 0.8,
          roughness: 0.2,
          transparent: true,
          opacity: 0.6,
          emissive: goldHighlight,
          emissiveIntensity: 0.3,
        });
        data.push({ mesh: child, ghost, highlight });
      }
    });
    return data;
  }, [scene]);

  // Apply ghost material to all meshes on mount
  useEffect(() => {
    meshData.forEach(({ mesh, ghost }) => {
      mesh.material = ghost;
    });
  }, [meshData]);

  // Update highlights based on active service
  useEffect(() => {
    const patterns = activeSlug ? serviceHighlightMap[activeSlug] || [] : [];

    meshData.forEach(({ mesh, ghost, highlight }) => {
      const name = mesh.name.toLowerCase();
      const isHighlighted = patterns.some((p) => name.includes(p));

      if (isHighlighted) {
        mesh.material = highlight;
      } else if (activeSlug && patterns.length > 0) {
        // Dim non-highlighted parts further
        ghost.opacity = 0.04;
        mesh.material = ghost;
      } else {
        ghost.opacity = 0.08;
        mesh.material = ghost;
      }
    });
  }, [activeSlug, meshData]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetX = (state.pointer.x * viewport.width) / 12;
    const targetY = (state.pointer.y * viewport.height) / 12;
    mouse.current.x += (targetX - mouse.current.x) * 0.02;
    mouse.current.y += (targetY - mouse.current.y) * 0.02;

    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = mouse.current.y * 0.05 + 0.1;
    groupRef.current.rotation.y = mouse.current.x * 0.08 + Math.sin(t * 0.15) * 0.08 - 0.3;
  });

  return (
    <group ref={groupRef} position={[1.5, -0.8, 0]} scale={2.5}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/volvo_v60_polestar_2013.glb");

interface VolvoDiagnosisSceneProps {
  activeSlug: string | null;
}

export default function VolvoDiagnosisScene({ activeSlug }: VolvoDiagnosisSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [5, 1.5, 5], fov: 40 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      <directionalLight position={[-3, 2, -2]} intensity={0.15} />
      <Environment preset="studio" />
      <VolvoModel activeSlug={activeSlug} />
    </Canvas>
  );
}
