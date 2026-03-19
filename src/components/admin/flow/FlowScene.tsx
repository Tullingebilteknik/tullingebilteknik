"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import type { LeadFlowPayload, LeadState } from "@/lib/lead-flow-types";
import { FlowNodeMesh } from "./FlowNodeMesh";
import { FlowEdgeMesh } from "./FlowEdgeMesh";

/* ── Inner scene ───────────────────────────────── */

function Scene({
  payload,
  activeNode,
  onNodeClick,
}: {
  payload: LeadFlowPayload;
  activeNode: LeadState | null;
  onNodeClick: (id: LeadState | null) => void;
}) {
  const nodeIds: LeadState[] = ["INCOMING", "TO_BE_CONTACTED", "BOOKED", "DEAL", "NO_DEAL"];

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Environment preset="studio" />

      {/* Edges (render behind nodes) */}
      {payload.edges.map((edge) => (
        <FlowEdgeMesh key={`${edge.source}-${edge.target}`} edge={edge} />
      ))}

      {/* Nodes */}
      {nodeIds.map((id) => (
        <FlowNodeMesh
          key={id}
          node={payload.nodes[id]}
          isActive={activeNode === id}
          onClick={() => onNodeClick(activeNode === id ? null : id)}
        />
      ))}

      {/* Click background to deselect */}
      <mesh position={[0, -1.5, -1]} onClick={() => onNodeClick(null)}>
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

/* ── Canvas wrapper ────────────────────────────── */

interface FlowCanvasProps {
  payload: LeadFlowPayload;
  activeNode: LeadState | null;
  onNodeClick: (id: LeadState | null) => void;
}

export default function FlowCanvas({ payload, activeNode, onNodeClick }: FlowCanvasProps) {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 45, position: [0, -1, 10], near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <Scene payload={payload} activeNode={activeNode} onNodeClick={onNodeClick} />
    </Canvas>
  );
}
