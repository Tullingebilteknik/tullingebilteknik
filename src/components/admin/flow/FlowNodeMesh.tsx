"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import type { FlowNode, LeadState } from "@/lib/lead-flow-types";
import { stateColors } from "@/lib/lead-flow-types";

/* ── Node positions ────────────────────────────── */

export const NODE_POSITIONS: Record<LeadState, [number, number, number]> = {
  INCOMING: [-6, 0, 0],
  TO_BE_CONTACTED: [-2, 0, 0],
  BOOKED: [2, 0, 0],
  DEAL: [6, 0, 0],
  NO_DEAL: [-2, -4, 0],
};

const NODE_WIDTH = 2.8;
const NODE_HEIGHT = 1.8;

/* ── Component ─────────────────────────────────── */

interface FlowNodeMeshProps {
  node: FlowNode;
  isActive: boolean;
  onClick: () => void;
}

export function FlowNodeMesh({ node, isActive, onClick }: FlowNodeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const pos = NODE_POSITIONS[node.id];
  const color = stateColors[node.id];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Smooth scale on hover/active
    const targetScale = hovered || isActive ? 1.06 : 1;
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.1);

    // Pulsing glow ring for active node
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      if (isActive) {
        const pulse = Math.sin(clock.elapsedTime * 3) * 0.3 + 0.7;
        mat.opacity = pulse * 0.5;
      } else {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.1);
      }
    }
  });

  const valueText =
    node.metrics.financialValue > 0
      ? `${node.id === "NO_DEAL" ? "-" : ""}${node.metrics.financialValue.toLocaleString("sv-SE")} kr`
      : "";

  return (
    <group
      ref={groupRef}
      position={pos}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* Glow ring (behind node) */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[NODE_WIDTH + 0.6, NODE_HEIGHT + 0.6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      {/* Glass node body */}
      <RoundedBox args={[NODE_WIDTH, NODE_HEIGHT, 0.15]} radius={0.15} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          transmission={0.4}
          roughness={0.15}
          thickness={0.5}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : isActive ? 0.2 : 0.08}
          transparent
          opacity={0.85}
        />
      </RoundedBox>

      {/* Label */}
      <Text
        position={[0, 0.45, 0.1]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="500"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {node.label}
      </Text>

      {/* Count */}
      <Text
        position={[0, -0.1, 0.1]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineWidth={0.015}
        outlineColor="#000000"
      >
        {node.metrics.count.toString()}
      </Text>

      {/* Value */}
      {valueText && (
        <Text
          position={[0, -0.6, 0.1]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="500"
          outlineWidth={0.008}
          outlineColor="#000000"
          fillOpacity={0.8}
        >
          {valueText}
        </Text>
      )}
    </group>
  );
}
