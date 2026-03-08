"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/2023_volvo_xc60.glb";
const DRACO_PATH = "/draco/gltf/";

// Material mappings per service (best-fit given material-based grouping in GLB)
const serviceHighlightMap: Record<string, string[]> = {
  // service-underhall uses special "all visible" flag — not listed here
  "bromsar": ["Carro_Disco"],
  "dack-hjul": ["Carro_Pneu", "Carro_Roda", "Carro_Roda_1"],
  "ac-service": ["Carro_Cromado", "Carro_Plastico_Brilho", "Carro_Plastico_1"],
  "felsökning-diagnostik": ["Carro_Painel", "Carro_Metal_Farol", "Carro_Metal_Farol_1", "Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3", "Carro_Espelhos"],
  "besiktningsförberedelse": ["Carro_Pintura", "Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Metal_Farol", "Carro_Metal_Farol_1", "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3", "Carro_Vidros2", "Carro_Vidros2_1", "Carro_Espelhos", "Carro_Disco", "Carro_Pneu", "Carro_Roda", "Carro_Roda_1"],
  "oljebyte": ["Carro_Metal_Preto", "Carro_Plastico_1"],
  "avgassystem": ["Carro_Metal_Preto", "Carro_Cromado"],
  "koppling-vaxellada": ["Carro_Metal_Preto", "Carro_Disco", "Carro_Plastico_1"],
  "elektronik-elsystem": ["Carro_Metal_Farol", "Carro_Metal_Farol_1", "Carro_Refletor_Farol", "Carro_Refletor_Farol_1", "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3", "Carro_Espelhos", "Carro_Painel"],
};

// Interior + dashboard materials to hide from ghost rendering
const hiddenMaterials = new Set([
  "Carro_Interno2", "Carro_Interno2_1", "Carro_Interno2_2", "Carro_Interno2_3",
  "Carro_Interno2_4", "Carro_Interno2_5", "Carro_Interno2_6", "Carro_Interno2_7",
  "Carro_Interno2_8", "Carro_Interno2_9", "Carro_Painel",
]);

// Sketch material — faint "pencil sketch" look for default state
const sketchMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#b0b8c4"),
  metalness: 0.1,
  roughness: 0.8,
  transparent: true,
  opacity: 0.05,
  depthWrite: false,
});

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
      sketch: THREE.MeshPhysicalMaterial;
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
        const sketch = sketchMaterial.clone();
        const highlight = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#d4dbe3"),
          metalness: 0.4,
          roughness: 0.35,
          transparent: true,
          opacity: 0.90,
          depthWrite: true,
          emissive: new THREE.Color("#ffffff"),
          emissiveIntensity: 0.08,
        });
        data.push({ mesh: child, originalMatName, sketch, highlight, isHiddenByDefault: isHidden });
      }
    });
    return data;
  }, [scene]);

  // Apply sketch material to visible meshes on mount
  useEffect(() => {
    meshData.forEach(({ mesh, sketch, isHiddenByDefault }) => {
      if (!isHiddenByDefault) {
        mesh.material = sketch;
      }
    });
  }, [meshData]);

  // Update highlights based on active service
  useEffect(() => {
    const normalizedSlug = activeSlug?.normalize("NFC") ?? null;
    const isFullService = normalizedSlug === "service-underhall";
    const patterns = normalizedSlug ? serviceHighlightMap[normalizedSlug] || [] : [];
    const hasActiveService = normalizedSlug && (isFullService || patterns.length > 0);

    meshData.forEach(({ mesh, originalMatName, sketch, highlight, isHiddenByDefault }) => {
      const isHighlighted = hasActiveService &&
        (isFullService ? !isHiddenByDefault : patterns.includes(originalMatName));

      if (isHighlighted) {
        mesh.visible = true;
        mesh.material = highlight;
      } else if (hasActiveService) {
        mesh.visible = !isHiddenByDefault;
        sketch.opacity = 0.03;
        mesh.material = sketch;
      } else {
        mesh.visible = !isHiddenByDefault;
        sketch.opacity = 0.05;
        mesh.material = sketch;
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.1} />
      <Environment preset="studio" />
      <VolvoModel activeSlug={activeSlug} />
    </Canvas>
  );
}
