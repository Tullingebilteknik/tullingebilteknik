"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/2023_volvo_xc60.glb";
const DRACO_PATH = "/draco/gltf/";

// Per-service highlight colors for visual distinction
const serviceColors: Record<string, string> = {
  "service-underhall": "#c9a84c",       // Gold — full service
  "bromsar": "#e63946",                 // Red — brakes
  "dack-hjul": "#c9a84c",              // Gold — wheels
  "ac-service": "#48cae4",             // Light blue — cooling/AC
  "felsökning-diagnostik": "#06d6a0",  // Green — diagnostics
  "besiktningsförberedelse": "#c9a84c", // Gold — inspection
  "oljebyte": "#f4a261",               // Amber — oil
  "avgassystem": "#adb5bd",            // Silver — exhaust
  "koppling-vaxellada": "#f4a261",     // Amber — drivetrain
  "elektronik-elsystem": "#06d6a0",    // Green — electronics
};

// Semantically correct material mappings per service
const serviceHighlightMap: Record<string, string[]> = {
  "service-underhall": ["Carro_Pintura", "Carro_Cromado", "Carro_Plastico_Brilho", "Carro_Vidros2", "Carro_Vidros2_1"],
  "bromsar": ["Carro_Disco", "Carro_Roda", "Carro_Roda_1"],
  "dack-hjul": ["Carro_Pneu", "Carro_Roda", "Carro_Roda_1"],
  "ac-service": ["Carro_Metal_Farol", "Carro_Metal_Farol_1", "Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Cromado"],
  "felsökning-diagnostik": ["Carro_Metal_Farol", "Carro_Metal_Farol_1", "Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Espelhos", "Carro_Painel", "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3"],
  "besiktningsförberedelse": ["Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Metal_Farol", "Carro_Metal_Farol_1", "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3", "Carro_Vidros2", "Carro_Vidros2_1", "Carro_Espelhos", "Carro_Disco", "Carro_Pneu", "Carro_Roda", "Carro_Roda_1"],
  "oljebyte": ["Carro_Metal_Preto", "Carro_Plastico_1"],
  "avgassystem": ["Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3", "Carro_Metal_Preto"],
  "koppling-vaxellada": ["Carro_Metal_Preto", "Carro_Disco"],
  "elektronik-elsystem": ["Carro_Metal_Farol", "Carro_Metal_Farol_1", "Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3", "Carro_Espelhos", "Carro_Painel"],
};

// Interior + dashboard materials to hide from ghost rendering
const hiddenMaterials = new Set([
  "Carro_Interno2", "Carro_Interno2_1", "Carro_Interno2_2", "Carro_Interno2_3",
  "Carro_Interno2_4", "Carro_Interno2_5", "Carro_Interno2_6", "Carro_Interno2_7",
  "Carro_Interno2_8", "Carro_Interno2_9", "Carro_Painel",
]);

const ghostMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#9ca3af"),
  metalness: 0.3,
  roughness: 0.6,
  transparent: true,
  opacity: 0.15,
  depthWrite: false,
});

const defaultHighlightColor = new THREE.Color("#c9a84c");

interface VolvoModelProps {
  activeSlug: string | null;
}

function VolvoModel({ activeSlug }: VolvoModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Store original material names and create per-mesh materials
  const meshData = useMemo(() => {
    const data: {
      mesh: THREE.Mesh;
      originalMatName: string;
      ghost: THREE.MeshPhysicalMaterial;
      highlight: THREE.MeshPhysicalMaterial;
      isHiddenByDefault: boolean;
    }[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.Material;
        const originalMatName = mat?.name || "";
        const isHidden = hiddenMaterials.has(originalMatName);
        if (isHidden) {
          child.visible = false;
        }
        const ghost = ghostMaterial.clone();
        const highlight = new THREE.MeshPhysicalMaterial({
          color: defaultHighlightColor,
          metalness: 0.6,
          roughness: 0.25,
          transparent: true,
          opacity: 0.85,
          emissive: defaultHighlightColor,
          emissiveIntensity: 0.6,
        });
        data.push({ mesh: child, originalMatName, ghost, highlight, isHiddenByDefault: isHidden });
      }
    });
    return data;
  }, [scene]);

  // Apply ghost material to visible meshes on mount
  useEffect(() => {
    meshData.forEach(({ mesh, ghost, isHiddenByDefault }) => {
      if (!isHiddenByDefault) {
        mesh.material = ghost;
      }
    });
  }, [meshData]);

  // Update highlights based on active service
  useEffect(() => {
    const normalizedSlug = activeSlug?.normalize("NFC") ?? null;
    const patterns = normalizedSlug ? serviceHighlightMap[normalizedSlug] || [] : [];
    const colorHex = normalizedSlug ? serviceColors[normalizedSlug] || "#c9a84c" : "#c9a84c";
    const hlColor = new THREE.Color(colorHex);

    meshData.forEach(({ mesh, originalMatName, ghost, highlight, isHiddenByDefault }) => {
      const isHighlighted = patterns.includes(originalMatName);

      if (isHighlighted) {
        // Show hidden meshes (like Painel) when they should be highlighted
        mesh.visible = true;
        highlight.color.copy(hlColor);
        highlight.emissive.copy(hlColor);
        mesh.material = highlight;
      } else if (normalizedSlug && patterns.length > 0) {
        // Hide meshes that are hidden by default, dim others
        mesh.visible = !isHiddenByDefault;
        ghost.opacity = 0.06;
        mesh.material = ghost;
      } else {
        // No service active — show ghost, hide hidden meshes
        mesh.visible = !isHiddenByDefault;
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
