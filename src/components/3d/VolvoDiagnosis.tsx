"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/2023_volvo_xc60.glb";
const DRACO_PATH = "/draco/gltf/";

// ─── Mesh-level highlight mappings ───────────────────────────────────
// The GLB groups meshes by material, not by car part. A single material
// like Carro_Roda includes wheel rims AND door handles. To highlight
// correctly, we match individual node names (Object_N) where needed,
// and fall back to material names for materials that are coherent.
//
// Node name mapping (Three.js child.name = node name, offset +2 from mesh index):
//   Carro_Roda_1:  Object_153 (front wheels), Object_154 (rear wheels)
//   Carro_Metal_Preto: Object_64 (underbody plate), Object_65-68 (4x wheel hubs)
//   Carro_Disco:  Object_5 (brake discs / undercarriage)
//   Carro_Pneu:   Object_141 (all tires)
//   Carro_Roda:   Objects 144-152 (rims + door handles + misc trim)
//   Carro_Plastico_1: Objects 117-118 (engine cowl / front plastic)
//   Carro_Plastico: Objects 84-116 (underbody plastic / body trim)
//   Carro_Cromado: Objects 3-4 (chrome trim strips)
//   Carro_Metal_Farol/1: Objects 61-63 (headlight housings)
//   Carro_Refletor_Farol/1: Objects 142-143 (headlight reflectors)
//   Carro_Vermelho_1/2/3: Objects 155-160 (rear tail lights)
//   Carro_Espelhos: Object_6 (side mirrors)
//   Carro_Painel: Object_69 (dashboard)
//   Carro_Pintura: Objects 70-83 (body paint panels)
//   Carro_Vidros2/1: Objects 2, 161-164 (windows/glass)

type HighlightRule = {
  materials?: string[];  // match by material name
  meshes?: string[];     // match by mesh name (Object_N)
};

const serviceHighlightMap: Record<string, HighlightRule> = {
  // service-underhall uses special "all visible" flag

  "bromsar": {
    // Brake discs + wheel rims (actual rim objects at axle positions)
    materials: ["Carro_Disco", "Carro_Roda_1"],
  },

  "dack-hjul": {
    // Tires + actual wheel rims at axle positions + wheel hub caps
    materials: ["Carro_Pneu", "Carro_Roda_1"],
    meshes: ["Object_65", "Object_66", "Object_67", "Object_68"], // hub caps (Metal_Preto at wheel positions)
  },

  "ac-service": {
    // Front grille area: chrome trim + front plastics + engine cowl
    materials: ["Carro_Cromado", "Carro_Plastico_1"],
  },

  "felsökning-diagnostik": {
    // Dashboard + all lights + mirrors = diagnostic check points
    materials: [
      "Carro_Painel", "Carro_Metal_Farol", "Carro_Metal_Farol_1",
      "Carro_Refletor_Farol", "Carro_Refletor_Farol_1",
      "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3",
      "Carro_Espelhos",
    ],
  },

  "besiktningsförberedelse": {
    // Broad inspection: body, lights, glass, mirrors, brakes, tires
    materials: [
      "Carro_Pintura", "Carro_Vidros2", "Carro_Vidros2_1",
      "Carro_Refletor_Farol", "Carro_Refletor_Farol_1",
      "Carro_Metal_Farol", "Carro_Metal_Farol_1",
      "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3",
      "Carro_Espelhos", "Carro_Disco", "Carro_Pneu", "Carro_Roda_1",
    ],
  },

  "oljebyte": {
    // Engine cowl plastics + underbody plate
    materials: ["Carro_Plastico_1"],
    meshes: ["Object_64"], // underbody plate (Metal_Preto)
  },

  "avgassystem": {
    // Underbody plate + chrome exhaust tips
    materials: ["Carro_Cromado"],
    meshes: ["Object_64"], // underbody plate
  },

  "koppling-vaxellada": {
    // Drivetrain: underbody + brake disc/undercarriage + engine cowl
    materials: ["Carro_Disco", "Carro_Plastico_1"],
    meshes: ["Object_64"], // underbody plate
  },

  "elektronik-elsystem": {
    // All lights + mirrors + dashboard
    materials: [
      "Carro_Metal_Farol", "Carro_Metal_Farol_1",
      "Carro_Refletor_Farol", "Carro_Refletor_Farol_1",
      "Carro_Vermelho_1", "Carro_Vermelho_2", "Carro_Vermelho_3",
      "Carro_Espelhos", "Carro_Painel",
    ],
  },
};

// Interior materials to hide from default rendering
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

  // Store mesh metadata and create per-mesh materials
  const meshData = useMemo(() => {
    const data: {
      mesh: THREE.Mesh;
      meshName: string;
      matName: string;
      sketch: THREE.MeshPhysicalMaterial;
      highlight: THREE.MeshPhysicalMaterial;
      isHiddenByDefault: boolean;
    }[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.Material;
        const matName = mat?.name || "";
        const meshName = child.name || "";
        const isHidden = hiddenMaterials.has(matName);
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
        data.push({ mesh: child, meshName, matName, sketch, highlight, isHiddenByDefault: isHidden });
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
    const rule = normalizedSlug ? serviceHighlightMap[normalizedSlug] : null;
    const hasActiveService = normalizedSlug != null && (isFullService || rule != null);

    const matSet = new Set(rule?.materials || []);
    const meshSet = new Set(rule?.meshes || []);

    meshData.forEach(({ mesh, meshName, matName, sketch, highlight, isHiddenByDefault }) => {
      const isHighlighted = hasActiveService &&
        (isFullService
          ? !isHiddenByDefault
          : matSet.has(matName) || meshSet.has(meshName));

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
