import { setup } from "xstate";
import type { Lead } from "./types";

/* ── State types ───────────────────────────────── */

export type LeadState = "INCOMING" | "TO_BE_CONTACTED" | "BOOKED" | "DEAL" | "NO_DEAL";

export interface NodeMetrics {
  count: number;
  financialValue: number;
}

export interface FlowNode {
  id: LeadState;
  label: string;
  metrics: NodeMetrics;
  energyLevel: number;
}

export interface FlowEdge {
  source: LeadState;
  target: LeadState;
  activeVolume: number;
  conversionRate: number;
}

export interface LeadFlowPayload {
  timestamp: string;
  nodes: Record<LeadState, FlowNode>;
  edges: FlowEdge[];
}

/* ── Status mapping ────────────────────────────── */

const statusToState: Record<Lead["status"], LeadState> = {
  ska_kontaktas: "TO_BE_CONTACTED",
  bokad: "BOOKED",
  ej_affar: "NO_DEAL",
  affar: "DEAL",
};

export const stateToDbStatus: Record<LeadState, Lead["status"] | null> = {
  INCOMING: null,
  TO_BE_CONTACTED: "ska_kontaktas",
  BOOKED: "bokad",
  DEAL: "affar",
  NO_DEAL: "ej_affar",
};

export const stateLabels: Record<LeadState, string> = {
  INCOMING: "Inkomna",
  TO_BE_CONTACTED: "Ska kontaktas",
  BOOKED: "Bokad",
  DEAL: "Affär",
  NO_DEAL: "Ej affär",
};

export const stateColors: Record<LeadState, string> = {
  INCOMING: "#94a3b8",
  TO_BE_CONTACTED: "#f59e0b",
  BOOKED: "#3b82f6",
  DEAL: "#22c55e",
  NO_DEAL: "#ef4444",
};

/* ── Compute payload from leads ────────────────── */

export function computeFlowPayload(leads: Lead[]): LeadFlowPayload {
  const total = leads.length;

  const counts: Record<LeadState, number> = {
    INCOMING: total,
    TO_BE_CONTACTED: 0,
    BOOKED: 0,
    DEAL: 0,
    NO_DEAL: 0,
  };

  const values: Record<LeadState, number> = {
    INCOMING: 0,
    TO_BE_CONTACTED: 0,
    BOOKED: 0,
    DEAL: 0,
    NO_DEAL: 0,
  };

  for (const lead of leads) {
    const state = statusToState[lead.status];
    counts[state]++;
    values[state] += lead.deal_value || 0;
    values.INCOMING += lead.deal_value || 0;
  }

  function buildNode(id: LeadState): FlowNode {
    return {
      id,
      label: stateLabels[id],
      metrics: { count: counts[id], financialValue: values[id] },
      energyLevel: total > 0 ? Math.min(counts[id] / total, 1) : 0,
    };
  }

  const nodes: Record<LeadState, FlowNode> = {
    INCOMING: buildNode("INCOMING"),
    TO_BE_CONTACTED: buildNode("TO_BE_CONTACTED"),
    BOOKED: buildNode("BOOKED"),
    DEAL: buildNode("DEAL"),
    NO_DEAL: buildNode("NO_DEAL"),
  };

  // Edge volumes: how many leads flowed through
  const processedCount = counts.TO_BE_CONTACTED + counts.BOOKED + counts.DEAL + counts.NO_DEAL;
  const bookedOrDeal = counts.BOOKED + counts.DEAL;

  const edges: FlowEdge[] = [
    {
      source: "INCOMING",
      target: "TO_BE_CONTACTED",
      activeVolume: processedCount,
      conversionRate: total > 0 ? processedCount / total : 0,
    },
    {
      source: "TO_BE_CONTACTED",
      target: "BOOKED",
      activeVolume: bookedOrDeal,
      conversionRate: processedCount > 0 ? bookedOrDeal / processedCount : 0,
    },
    {
      source: "BOOKED",
      target: "DEAL",
      activeVolume: counts.DEAL,
      conversionRate: bookedOrDeal > 0 ? counts.DEAL / bookedOrDeal : 0,
    },
    {
      source: "TO_BE_CONTACTED",
      target: "NO_DEAL",
      activeVolume: counts.NO_DEAL,
      conversionRate: processedCount > 0 ? counts.NO_DEAL / processedCount : 0,
    },
  ];

  return {
    timestamp: new Date().toISOString(),
    nodes,
    edges,
  };
}

/* ── XState machine ────────────────────────────── */

export const leadMachine = setup({
  types: {
    events: {} as
      | { type: "PROCESS" }
      | { type: "BOOK" }
      | { type: "WIN" }
      | { type: "LOSE" },
  },
}).createMachine({
  id: "leadEngine",
  initial: "INCOMING",
  states: {
    INCOMING: {
      on: { PROCESS: "TO_BE_CONTACTED" },
    },
    TO_BE_CONTACTED: {
      on: {
        BOOK: "BOOKED",
        LOSE: "NO_DEAL",
      },
    },
    BOOKED: {
      on: {
        WIN: "DEAL",
        LOSE: "NO_DEAL",
      },
    },
    DEAL: { type: "final" },
    NO_DEAL: { type: "final" },
  },
});
