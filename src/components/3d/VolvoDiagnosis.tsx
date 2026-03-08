"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

const MODEL_PATH = "/models/2023_bmw_m3_touring.glb";
const DRACO_PATH = "/draco/gltf/";

// ─── Service highlight mappings ──────────────────────────────────────
const serviceHighlightMap: Record<string, string[]> = {
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

const hiddenKeywords = ["Interior"];

function matchesMaterial(matName: string, keywords: string[]): boolean {
  return keywords.some((kw) => matName.includes(kw));
}

type MaterialState = "highlighted" | "ghost" | "ghost-paint" | "default";

function classifyMaterials(
  slug: string | null,
  materialNames: string[]
): Map<string, MaterialState> {
  const result = new Map<string, MaterialState>();
  const normalized = slug?.normalize("NFC") ?? null;
  const isFullService = normalized === "service-underhall";
  const keywords = normalized ? serviceHighlightMap[normalized] || [] : [];
  const hasActive = normalized != null && (isFullService || keywords.length > 0);

  for (const matName of materialNames) {
    if (!hasActive) {
      result.set(matName, "default");
    } else if (isFullService || matchesMaterial(matName, keywords)) {
      result.set(matName, "highlighted");
    } else if (matName.includes("Paint")) {
      result.set(matName, "ghost-paint");
    } else {
      result.set(matName, "ghost");
    }
  }
  return result;
}

const stateTargets: Record<MaterialState, { opacity: number; emissiveIntensity: number }> = {
  default:       { opacity: 0.85, emissiveIntensity: 0.0 },
  highlighted:   { opacity: 1.0,  emissiveIntensity: 0.25 },
  ghost:         { opacity: 0.08, emissiveIntensity: 0.0 },
  "ghost-paint": { opacity: 0.12, emissiveIntensity: 0.0 },
};

interface CarModelProps {
  activeSlug: string | null;
}

function CarModel({ activeSlug }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Clone materials per unique name & collect mesh metadata
  const { materialMap, interiorMeshes } = useMemo(() => {
    const matMap = new Map<string, THREE.MeshPhysicalMaterial>();
    const intMeshes: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const origMat = child.material as THREE.MeshPhysicalMaterial;
      const matName = origMat?.name || "";

      if (!matMap.has(matName)) {
        const cloned = origMat.clone();
        cloned.transparent = true;
        cloned.opacity = 0.85;
        cloned.userData.originalEmissive = cloned.emissive.clone();
        cloned.emissiveIntensity = 0.0;
        cloned.depthWrite = true;
        cloned.name = matName;
        matMap.set(matName, cloned);
      }

      child.material = matMap.get(matName)!;

      if (matchesMaterial(matName, hiddenKeywords)) {
        child.visible = false;
        intMeshes.push(child);
      }
    });

    return { materialMap: matMap, interiorMeshes: intMeshes };
  }, [scene]);

  // GSAP-animated highlight transitions
  useEffect(() => {
    const classification = classifyMaterials(activeSlug, Array.from(materialMap.keys()));

    // Kill all running tweens
    materialMap.forEach((mat) => gsap.killTweensOf(mat));

    materialMap.forEach((mat, matName) => {
      const state = classification.get(matName) || "default";
      const t = stateTargets[state];

      mat.depthWrite = state === "highlighted" || state === "default";

      // Set emissive color: soft glow for highlighted, restore original otherwise
      if (state === "highlighted") {
        mat.emissive.set("#aabbcc");
      } else {
        mat.emissive.copy(mat.userData.originalEmissive);
      }

      gsap.to(mat, {
        opacity: t.opacity,
        emissiveIntensity: t.emissiveIntensity,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    // Handle Interior visibility (show only when highlighted)
    interiorMeshes.forEach((mesh) => {
      const matName = (mesh.material as THREE.Material).name;
      const state = classification.get(matName);

      if (state === "highlighted" && !mesh.visible) {
        mesh.visible = true;
        (mesh.material as THREE.MeshPhysicalMaterial).opacity = 0;
        gsap.to(mesh.material, {
          opacity: 1.0,
          duration: 0.45,
          ease: "power2.out",
        });
      } else if (state !== "highlighted" && mesh.visible) {
        gsap.to(mesh.material, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => { mesh.visible = false; },
        });
      }
    });

    return () => {
      materialMap.forEach((mat) => gsap.killTweensOf(mat));
    };
  }, [activeSlug, materialMap, interiorMeshes]);

  // Gentle mouse-follow rotation
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
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <directionalLight position={[-3, 2, -2]} intensity={0.2} />
      <Environment preset="studio" />
      <CarModel activeSlug={activeSlug} />
    </Canvas>
  );
}
