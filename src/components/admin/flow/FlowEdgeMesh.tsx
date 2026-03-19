"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FlowEdge } from "@/lib/lead-flow-types";
import { stateColors, type LeadState } from "@/lib/lead-flow-types";

/* ── Node positions (must match FlowScene) ────── */

const NODE_POSITIONS: Record<LeadState, [number, number, number]> = {
  INCOMING: [-6, 0, 0],
  TO_BE_CONTACTED: [-2, 0, 0],
  BOOKED: [2, 0, 0],
  DEAL: [6, 0, 0],
  NO_DEAL: [-2, -4, 0],
};

/* ── GLSL Shaders ──────────────────────────────── */

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float u_time;
uniform float u_energyLevel;
uniform vec3 u_color;
varying vec2 vUv;

void main() {
  float speed = 2.0 + (u_energyLevel * 5.0);
  float pulse = sin(vUv.x * 20.0 - u_time * speed) * 0.5 + 0.5;

  // Core glow
  vec3 finalColor = u_color * pulse * (0.5 + u_energyLevel * 2.5);

  // Edge fade for tube shape
  float edgeFade = 1.0 - abs(vUv.y - 0.5) * 2.0;
  edgeFade = smoothstep(0.0, 0.5, edgeFade);

  float alpha = smoothstep(0.2, 0.8, pulse) * u_energyLevel * edgeFade;

  gl_FragColor = vec4(finalColor, alpha);
}
`;

/* ── Component ─────────────────────────────────── */

interface FlowEdgeMeshProps {
  edge: FlowEdge;
}

export function FlowEdgeMesh({ edge }: FlowEdgeMeshProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const sourcePos = NODE_POSITIONS[edge.source];
  const targetPos = NODE_POSITIONS[edge.target];
  const color = new THREE.Color(stateColors[edge.target]);

  const curve = useMemo(() => {
    const start = new THREE.Vector3(...sourcePos);
    const end = new THREE.Vector3(...targetPos);
    const mid = start.clone().lerp(end, 0.5);

    // Vertical edge (to NO_DEAL)
    if (edge.target === "NO_DEAL") {
      const cp1 = new THREE.Vector3(sourcePos[0], sourcePos[1] - 1.5, 0);
      const cp2 = new THREE.Vector3(targetPos[0], targetPos[1] + 1.5, 0);
      return new THREE.CubicBezierCurve3(start, cp1, cp2, end);
    }

    // Horizontal edges
    const cp1 = new THREE.Vector3(mid.x - 0.8, mid.y + 0.3, 0);
    const cp2 = new THREE.Vector3(mid.x + 0.8, mid.y + 0.3, 0);
    return new THREE.CubicBezierCurve3(start, cp1, cp2, end);
  }, [sourcePos, targetPos, edge.target]);

  const tubeRadius = Math.max(0.03, edge.conversionRate * 0.15);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_energyLevel: { value: 0 },
      u_color: { value: color },
    }),
    [color]
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.u_time.value = clock.elapsedTime;
    materialRef.current.uniforms.u_energyLevel.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.u_energyLevel.value,
      Math.max(0.15, edge.conversionRate),
      0.05
    );
  });

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, tubeRadius, 8, false]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
