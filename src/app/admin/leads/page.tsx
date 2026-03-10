"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Mail, MessageSquare, Filter, AlertCircle } from "lucide-react";

const statusLabels: Record<string, string> = {
  new: "Ny",
  contacted: "Kontaktad",
  done: "Klar",
};

const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLeads(data);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: status as Lead["status"] } : l)));
    if (selectedLead?.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, status: status as Lead["status"] } : null));
    }
  }

  async function saveNotes() {
    if (!selectedLead) return;
    await supabase.from("leads").update({ notes }).eq("id", selectedLead.id);
    setLeads((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? { ...l, notes } : l))
    );
  }

  const filteredLeads = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="new">Nya</SelectItem>
              <SelectItem value="contacted">Kontaktade</SelectItem>
              <SelectItem value="done">Klara</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Namn</TableHead>
              <TableHead>Fordon</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>Tjänst</TableHead>
              <TableHead>Tid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  Inga leads att visa.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => {
                    setSelectedLead(lead);
                    setNotes(lead.notes || "");
                  }}
                >
                  <TableCell className={`font-medium ${lead.preferred_time === "Snarast" ? "font-bold" : ""}`}>
                    {lead.name}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {lead.reg_number || lead.car_model ? (
                      <div>
                        {lead.reg_number && <span className="font-mono font-medium text-slate-700">{lead.reg_number}</span>}
                        {lead.car_model && <p className="text-xs">{lead.car_model}</p>}
                      </div>
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
                          <Phone className="h-3 w-3" /> {lead.phone}
                        </a>
                      )}
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {lead.selected_services?.length
                      ? lead.selected_services.join(", ")
                      : lead.service_interest || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {lead.preferred_time === "Snarast" ? (
                      <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                        <AlertCircle className="h-3.5 w-3.5" /> Snarast
                      </span>
                    ) : lead.preferred_time ? (
                      <span className="text-slate-500">{lead.preferred_time}</span>
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(val) => updateStatus(lead.id, val)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <Badge className={`${statusColors[lead.status]} border-0`}>
                          {statusLabels[lead.status]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Ny</SelectItem>
                        <SelectItem value="contacted">Kontaktad</SelectItem>
                        <SelectItem value="done">Klar</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(lead.created_at).toLocaleDateString("sv-SE")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedLead(lead);
                        setNotes(lead.notes || "");
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedLead?.name}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Telefon</p>
                  <a href={`tel:${selectedLead.phone}`} className="font-medium hover:text-amber-600">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <p className="text-slate-500">E-post</p>
                  <a href={`mailto:${selectedLead.email}`} className="font-medium hover:text-amber-600">
                    {selectedLead.email || "—"}
                  </a>
                </div>
                {selectedLead.reg_number && (
                  <div>
                    <p className="text-slate-500">Registreringsnummer</p>
                    <p className="font-mono font-semibold">{selectedLead.reg_number}</p>
                  </div>
                )}
                {selectedLead.car_model && (
                  <div>
                    <p className="text-slate-500">Bil</p>
                    <p className="font-medium">{selectedLead.car_model}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-500">Tjänster</p>
                  {selectedLead.selected_services?.length ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedLead.selected_services.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="font-medium">{selectedLead.service_interest || "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-slate-500">Önskad tid</p>
                  {selectedLead.preferred_time === "Snarast" ? (
                    <p className="font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Snarast
                    </p>
                  ) : (
                    <p className="font-medium">{selectedLead.preferred_time || "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-slate-500">Källa</p>
                  <p className="font-medium">{selectedLead.source_page}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Meddelande</p>
                <p className="text-sm bg-slate-50 rounded-lg p-3">{selectedLead.message}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Interna anteckningar</p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Skriv anteckningar här..."
                  rows={3}
                />
                <Button size="sm" className="mt-2" onClick={saveNotes}>
                  Spara anteckningar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
