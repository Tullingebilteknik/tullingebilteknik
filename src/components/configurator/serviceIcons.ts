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
  type LucideIcon,
} from "lucide-react";

export const serviceOptions: { label: string; icon: LucideIcon }[] = [
  { label: "Service & underhåll", icon: Settings },
  { label: "Bromsar", icon: ShieldCheck },
  { label: "Däck & hjul", icon: Circle },
  { label: "AC-service", icon: Thermometer },
  { label: "Felsökning & diagnostik", icon: Search },
  { label: "Besiktningsförberedelse", icon: ClipboardCheck },
  { label: "Oljebyte", icon: Droplets },
  { label: "Avgassystem", icon: Wind },
  { label: "Koppling & växellåda", icon: Cog },
  { label: "Elektronik & elsystem", icon: Zap },
  { label: "Övrigt", icon: MoreHorizontal },
];
