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

function classifyMaterial(
  slug: string | null,
  matName: string
): MaterialState {
  const normalized = slug?.normalize("NFC") ?? null;
  const isFullService = normalized === "service-underhall";
  const keywords = normalized ? serviceHighlightMap[normalized] || [] : [];
  const hasActive = normalized != null && (isFullService || keywords.length > 0);

  if (!hasActive) return "default";
  if (isFullService || matchesMaterial(matName, keywords)) return "highlighted";
  if (matName.includes("Paint")) return "ghost-paint";
  return "ghost";
}

// ─── Create animatable material preserving original look ─────────────
function createAnimatableMaterial(orig: THREE.MeshPhysicalMaterial): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    color: orig.color.clone(),
    metalness: orig.metalness,
    roughness: orig.roughness,
    clearcoat: orig.clearcoat,
    clearcoatRoughness: orig.clearcoatRoughness,
    transparent: true,
    opacity: 0.85,
    depthWrite: true,
    emissive: orig.emissive.clone(),
    emissiveIntensity: 0,
  });

  // Share texture references — NO clone = NO extra GPU memory
  mat.map = orig.map;
  mat.normalMap = orig.normalMap;
  mat.roughnessMap = orig.roughnessMap;
  mat.metalnessMap = orig.metalnessMap;
  mat.envMap = orig.envMap;
  mat.aoMap = orig.aoMap;
  mat.emissiveMap = orig.emissiveMap;
  mat.name = orig.name;

  // Store base emissive for highlight glow calculation
  mat.userData.baseEmissiveIntensity = orig.emissiveIntensity;

  return mat;
}

interface CarModelProps {
  activeSlug: string | null;
}

function CarModel({ activeSlug }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Build 22 animatable materials (one per unique name) + collect mesh data
  const { materialMap, interiorMeshes, meshData } = useMemo(() => {
    const matMap = new Map<string, THREE.MeshPhysicalMaterial>();
    const intMeshes: THREE.Mesh[] = [];
    const data: { mesh: THREE.Mesh; matName: string }[] = [];

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const orig = child.material as THREE.MeshPhysicalMaterial;
      const matName = orig?.name || "";

      if (!matMap.has(matName)) {
        matMap.set(matName, createAnimatableMaterial(orig));
      }

      child.material = matMap.get(matName)!;

      if (matchesMaterial(matName, hiddenKeywords)) {
        child.visible = false;
        intMeshes.push(child);
      }

      data.push({ mesh: child, matName });
    });

    console.log("Material names:", Array.from(matMap.keys()));
    return { materialMap: matMap, interiorMeshes: intMeshes, meshData: data };
  }, [scene]);

  // GSAP-animated highlight transitions
  useEffect(() => {
    // Kill all running tweens
    materialMap.forEach((mat) => gsap.killTweensOf(mat));

    materialMap.forEach((mat, matName) => {
      const state = classifyMaterial(activeSlug, matName);
      const baseEmissive = (mat.userData.baseEmissiveIntensity as number) || 0;

      mat.depthWrite = state === "highlighted" || state === "default";

      const targets: Record<MaterialState, { opacity: number; emissiveIntensity: number }> = {
        default:       { opacity: 0.85, emissiveIntensity: baseEmissive },
        highlighted:   { opacity: 1.0,  emissiveIntensity: baseEmissive + 0.12 },
        ghost:         { opacity: 0.06, emissiveIntensity: 0 },
        "ghost-paint": { opacity: 0.10, emissiveIntensity: 0 },
      };

      gsap.to(mat, {
        ...targets[state],
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    // Handle Interior visibility (show only when highlighted)
    interiorMeshes.forEach((mesh) => {
      const entry = meshData.find((d) => d.mesh === mesh);
      const matName = entry?.matName || "";
      const state = classifyMaterial(activeSlug, matName);

      if (state === "highlighted" && !mesh.visible) {
        mesh.visible = true;
        (mesh.material as THREE.MeshPhysicalMaterial).opacity = 0;
        gsap.to(mesh.material, {
          opacity: 1.0,
          duration: 0.5,
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
  }, [activeSlug, materialMap, interiorMeshes, meshData]);

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
