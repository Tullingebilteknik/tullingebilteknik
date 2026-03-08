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

// ─── 4 shared materials (NO cloning = no WebGL Context Lost) ─────────
const defaultMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#c8cdd3"),
  metalness: 0.3,
  roughness: 0.6,
  transparent: true,
  opacity: 0.85,
  depthWrite: true,
});

const ghostMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#b0b8c4"),
  metalness: 0.1,
  roughness: 0.8,
  transparent: true,
  opacity: 0.08,
  depthWrite: false,
});

const ghostPaintMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#c0c6cc"),
  metalness: 0.15,
  roughness: 0.7,
  transparent: true,
  opacity: 0.12,
  depthWrite: false,
});

const highlightMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#e8dcc8"),
  metalness: 0.45,
  roughness: 0.3,
  transparent: true,
  opacity: 1.0,
  depthWrite: true,
  emissive: new THREE.Color("#d4c5a0"),
  emissiveIntensity: 0.15,
});

const materialForState: Record<MaterialState, THREE.MeshPhysicalMaterial> = {
  default: defaultMat,
  ghost: ghostMat,
  "ghost-paint": ghostPaintMat,
  highlighted: highlightMat,
};

const targetOpacity: Record<MaterialState, number> = {
  default: 0.85,
  ghost: 0.08,
  "ghost-paint": 0.12,
  highlighted: 1.0,
};

interface CarModelProps {
  activeSlug: string | null;
}

function CarModel({ activeSlug }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const prevSlugRef = useRef<string | null>(null);

  // Collect mesh metadata (no cloning, just store references)
  const { meshData, interiorMeshes } = useMemo(() => {
    const data: { mesh: THREE.Mesh; matName: string }[] = [];
    const intMeshes: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const origMat = child.material as THREE.MeshPhysicalMaterial;
      const matName = origMat?.name || "";

      // Set default material immediately
      child.material = defaultMat;

      if (matchesMaterial(matName, hiddenKeywords)) {
        child.visible = false;
        intMeshes.push(child);
      }

      data.push({ mesh: child, matName });
    });

    return { meshData: data, interiorMeshes: intMeshes };
  }, [scene]);

  // GSAP-animated highlight transitions
  useEffect(() => {
    const isFirstRender = prevSlugRef.current === null && activeSlug === null;
    prevSlugRef.current = activeSlug;

    // Kill running tweens on shared materials
    gsap.killTweensOf(defaultMat);
    gsap.killTweensOf(ghostMat);
    gsap.killTweensOf(ghostPaintMat);
    gsap.killTweensOf(highlightMat);

    if (isFirstRender) {
      // First render: just assign default material, no animation
      return;
    }

    // Capture current opacity to use as animation start point
    const currentOpacity = defaultMat.opacity;

    // Reset all shared materials to current visual state (seamless start)
    ghostMat.opacity = currentOpacity;
    ghostPaintMat.opacity = currentOpacity;
    highlightMat.opacity = currentOpacity;
    highlightMat.emissiveIntensity = 0;

    // Assign correct material to each mesh
    meshData.forEach(({ mesh, matName }) => {
      if (matchesMaterial(matName, hiddenKeywords)) return; // skip interior
      const state = classifyMaterial(activeSlug, matName);
      mesh.material = materialForState[state];
      mesh.material.depthWrite = state === "highlighted" || state === "default";
    });

    // Handle Interior visibility
    interiorMeshes.forEach((mesh) => {
      const matName = meshData.find((d) => d.mesh === mesh)?.matName || "";
      const state = classifyMaterial(activeSlug, matName);

      if (state === "highlighted") {
        mesh.visible = true;
        mesh.material = highlightMat;
      } else {
        mesh.visible = false;
      }
    });

    // Animate shared materials from current opacity to their targets
    gsap.to(defaultMat, {
      opacity: targetOpacity.default,
      duration: 0.45,
      ease: "power2.out",
    });
    gsap.to(ghostMat, {
      opacity: targetOpacity.ghost,
      duration: 0.45,
      ease: "power2.out",
    });
    gsap.to(ghostPaintMat, {
      opacity: targetOpacity["ghost-paint"],
      duration: 0.45,
      ease: "power2.out",
    });
    gsap.to(highlightMat, {
      opacity: targetOpacity.highlighted,
      emissiveIntensity: 0.15,
      duration: 0.45,
      ease: "power2.out",
    });

    return () => {
      gsap.killTweensOf(defaultMat);
      gsap.killTweensOf(ghostMat);
      gsap.killTweensOf(ghostPaintMat);
      gsap.killTweensOf(highlightMat);
    };
  }, [activeSlug, meshData, interiorMeshes]);

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
