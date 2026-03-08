"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/2023_volvo_xc60.glb";
const DRACO_PATH = "/draco/gltf/";

// Map service slugs to exact material names (XC60 uses Portuguese material names)
const serviceHighlightMap: Record<string, string[]> = {
  "service-underhall": ["Carro_Pintura", "Carro_Cromado", "Carro_Plastico_Brilho"],
  "bromsar": ["Carro_Disco"],
  "dack-hjul": ["Carro_Roda", "Carro_Roda_1", "Carro_Pneu"],
  "ac-service": ["Carro_Metal_Farol", "Carro_Metal_Farol_1", "Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Cromado"],
  "felsökning-diagnostik": ["Carro_Vidros2", "Carro_Vidros2_1", "Carro_Espelhos", "Carro_Painel"],
  "besiktningsförberedelse": ["Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3", "Carro_Vidros2", "Carro_Vidros2_1", "Carro_Espelhos"],
  "oljebyte": ["Carro_Plastico", "Carro_Plastico_1"],
  "avgassystem": ["Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3", "Carro_Plastico_1"],
  "koppling-vaxellada": ["Carro_Metal_Preto", "Carro_Disco"],
  "elektronik-elsystem": ["Carro_Metal_Farol", "Carro_Metal_Farol_1", "Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3", "Carro_Espelhos", "Carro_Painel"],
};

// Interior materials to hide completely (not visible from outside)
const hiddenMaterials = new Set(["Carro_Interno2", "Carro_Interno2_1", "Carro_Interno2_2", "Carro_Interno2_3", "Carro_Interno2_4", "Carro_Interno2_5", "Carro_Interno2_6", "Carro_Interno2_7", "Carro_Interno2_8", "Carro_Interno2_9"]);

const ghostMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#9ca3af"),
  metalness: 0.3,
  roughness: 0.6,
  transparent: true,
  opacity: 0.15,
  depthWrite: false,
});

const goldHighlight = new THREE.Color("#c9a84c");

interface VolvoModelProps {
  activeSlug: string | null;
}

function VolvoModel({ activeSlug }: VolvoModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Store original material names and create per-mesh highlight materials
  const meshData = useMemo(() => {
    const data: {
      mesh: THREE.Mesh;
      originalMatName: string;
      ghost: THREE.MeshPhysicalMaterial;
      highlight: THREE.MeshPhysicalMaterial;
    }[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.Material;
        const originalMatName = mat?.name || "";
        // Hide interior meshes completely
        if (hiddenMaterials.has(originalMatName)) {
          child.visible = false;
          return;
        }
        const ghost = ghostMaterial.clone();
        const highlight = new THREE.MeshPhysicalMaterial({
          color: goldHighlight,
          metalness: 0.6,
          roughness: 0.25,
          transparent: true,
          opacity: 0.85,
          emissive: goldHighlight,
          emissiveIntensity: 0.6,
        });
        data.push({ mesh: child, originalMatName, ghost, highlight });
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
    const normalizedSlug = activeSlug?.normalize("NFC") ?? null;
    const patterns = normalizedSlug ? serviceHighlightMap[normalizedSlug] || [] : [];

    meshData.forEach(({ mesh, originalMatName, ghost, highlight }) => {
      const isHighlighted = patterns.includes(originalMatName);

      if (isHighlighted) {
        mesh.material = highlight;
      } else if (normalizedSlug && patterns.length > 0) {
        ghost.opacity = 0.06;
        mesh.material = ghost;
      } else {
        ghost.opacity = 0.15;
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
    <group ref={groupRef} position={[1.5, -0.5, 0]} scale={1.6}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH, DRACO_PATH);

interface VolvoDiagnosisSceneProps {
  activeSlug: string | null;
}

export default function VolvoDiagnosisScene({ activeSlug }: VolvoDiagnosisSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [6, 1.5, 6], fov: 35 }}
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
