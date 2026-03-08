"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/2023_bmw_m3_touring.glb";
const DRACO_PATH = "/draco/gltf/";

// ─── Service highlight mappings ──────────────────────────────────────
// BMW M3 Touring materials are semantically named. We match by substring
// in the material name (e.g. "Engine" matches "...EngineA_Material").
//
// Available semantic keywords in material names:
//   Paint, Coloured, Window, RED_GLASS, Light, Engine, Grille(1-8),
//   Wheel, Calliper, CalliperBadge, Carbon, Interior, Badge, Base,
//   ManufacturerPlate

const serviceHighlightMap: Record<string, string[]> = {
  // service-underhall uses special "all visible" flag
  "bromsar": ["Calliper", "Wheel"],
  "dack-hjul": ["Wheel"],
  "ac-service": ["Engine", "Grille"],
  "felsökning-diagnostik": ["Light", "RED_GLASS", "Interior", "Engine"],
  "besiktningsförberedelse": ["Light", "RED_GLASS", "Window", "Wheel", "Calliper", "Paint"],
  "oljebyte": ["Engine"],
  "avgassystem": ["Engine", "Base"],
  "koppling-vaxellada": ["Engine", "Wheel"],
  "elektronik-elsystem": ["Light", "RED_GLASS", "Interior"],
};

// Materials to hide by default (visible through windows otherwise)
const hiddenKeywords = ["Interior"];

function matchesMaterial(matName: string, keywords: string[]): boolean {
  return keywords.some((kw) => matName.includes(kw));
}

// Shared materials — only 4 instances total instead of 2600+
const sketchMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#b0b8c4"),
  metalness: 0.1,
  roughness: 0.8,
  transparent: true,
  opacity: 0.05,
  depthWrite: false,
});

const sketchDimmedMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#b0b8c4"),
  metalness: 0.1,
  roughness: 0.8,
  transparent: true,
  opacity: 0.03,
  depthWrite: false,
});

const highlightMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#d4dbe3"),
  metalness: 0.4,
  roughness: 0.35,
  transparent: true,
  opacity: 0.90,
  depthWrite: true,
  emissive: new THREE.Color("#ffffff"),
  emissiveIntensity: 0.08,
});

interface CarModelProps {
  activeSlug: string | null;
}

function CarModel({ activeSlug }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Collect mesh metadata (no material cloning — shared materials)
  const meshData = useMemo(() => {
    const data: {
      mesh: THREE.Mesh;
      matName: string;
      isHiddenByDefault: boolean;
    }[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.Material;
        const matName = mat?.name || "";
        const isHidden = matchesMaterial(matName, hiddenKeywords);
        if (isHidden) {
          child.visible = false;
        }
        data.push({ mesh: child, matName, isHiddenByDefault: isHidden });
      }
    });
    return data;
  }, [scene]);

  // Apply sketch material to visible meshes on mount
  useEffect(() => {
    meshData.forEach(({ mesh, isHiddenByDefault }) => {
      if (!isHiddenByDefault) {
        mesh.material = sketchMat;
      }
    });
  }, [meshData]);

  // Update highlights based on active service
  useEffect(() => {
    const normalizedSlug = activeSlug?.normalize("NFC") ?? null;
    const isFullService = normalizedSlug === "service-underhall";
    const keywords = normalizedSlug ? serviceHighlightMap[normalizedSlug] || [] : [];
    const hasActiveService = normalizedSlug != null && (isFullService || keywords.length > 0);

    meshData.forEach(({ mesh, matName, isHiddenByDefault }) => {
      const isHighlighted = hasActiveService &&
        (isFullService ? !isHiddenByDefault : matchesMaterial(matName, keywords));

      if (isHighlighted) {
        mesh.visible = true;
        mesh.material = highlightMat;
      } else if (hasActiveService) {
        mesh.visible = !isHiddenByDefault;
        mesh.material = sketchDimmedMat;
      } else {
        mesh.visible = !isHiddenByDefault;
        mesh.material = sketchMat;
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
    <group ref={groupRef} position={[1.5, -0.5, 0]} scale={160}>
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.1} />
      <Environment preset="studio" />
      <CarModel activeSlug={activeSlug} />
    </Canvas>
  );
}
