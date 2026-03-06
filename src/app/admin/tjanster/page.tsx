"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, GripVertical } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editService, setEditService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadServices() {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");
    if (data) setServices(data);
  }

  async function toggleVisibility(id: string, visible: boolean) {
    await supabase.from("services").update({ is_visible: visible }).eq("id", id);
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_visible: visible } : s))
    );
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editService) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      long_description: formData.get("long_description") as string,
    };

    await supabase.from("services").update(updates).eq("id", editService.id);
    setDialogOpen(false);
    loadServices();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Tjänster</h1>

      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Tjänst</TableHead>
              <TableHead>Beskrivning</TableHead>
              <TableHead className="w-24 text-center">Synlig</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <GripVertical className="h-4 w-4 text-slate-400" />
                </TableCell>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell className="text-sm text-slate-500 max-w-xs truncate">
                  {service.description}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={service.is_visible}
                    onCheckedChange={(checked) =>
                      toggleVisibility(service.id, checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Dialog
                    open={dialogOpen && editService?.id === service.id}
                    onOpenChange={(open) => {
                      setDialogOpen(open);
                      if (open) setEditService(service);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Redigera tjänst</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Titel</Label>
                          <Input
                            id="title"
                            name="title"
                            defaultValue={service.title}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Kort beskrivning</Label>
                          <Textarea
                            id="description"
                            name="description"
                            defaultValue={service.description}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="long_description">Lång beskrivning</Label>
                          <Textarea
                            id="long_description"
                            name="long_description"
                            defaultValue={service.long_description}
                            rows={5}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                          >
                            Avbryt
                          </Button>
                          <Button type="submit">Spara</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
