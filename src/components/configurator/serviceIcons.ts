import {
  Settings,
  ShieldCheck,
  Circle,
  Thermometer,
  Search,
  ClipboardCheck,
  Droplets,
  Wind,
  Cog,
  Zap,
  MoreHorizontal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface ServiceOption {
  label: string;
  icon: LucideIcon;
  category: "verkstad" | "tvatt_rekond";
}

export const serviceOptions: ServiceOption[] = [
  { label: "Service & underhåll", icon: Settings, category: "verkstad" },
  { label: "Bromsar", icon: ShieldCheck, category: "verkstad" },
  { label: "Däck & hjul", icon: Circle, category: "verkstad" },
  { label: "AC-service", icon: Thermometer, category: "verkstad" },
  { label: "Felsökning & diagnostik", icon: Search, category: "verkstad" },
  { label: "Besiktningsförberedelse", icon: ClipboardCheck, category: "verkstad" },
  { label: "Oljebyte", icon: Droplets, category: "verkstad" },
  { label: "Avgassystem", icon: Wind, category: "verkstad" },
  { label: "Koppling & växellåda", icon: Cog, category: "verkstad" },
  { label: "Elektronik & elsystem", icon: Zap, category: "verkstad" },
  { label: "Övrigt", icon: MoreHorizontal, category: "verkstad" },
  { label: "Utvändig tvätt", icon: Droplets, category: "tvatt_rekond" },
  { label: "Utvändig tvätt med lätt städ", icon: Droplets, category: "tvatt_rekond" },
  { label: "Utvändig tvätt med invändig städ", icon: Sparkles, category: "tvatt_rekond" },
];
