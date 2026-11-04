import type { Category } from "../types";

export const CATEGORIES: Category[] = [
  { id: "velas", name: "Velas", label: "Vela", icon: "candle" },
  { id: "difusores", name: "Difusores", label: "Difusor", icon: "diffuser" },
  { id: "sprays", name: "Sprays", label: "Spray", icon: "spray" },
  { id: "saches", name: "Sachês", label: "Sachê", icon: "sachet" },
  { id: "incensos", name: "Incensos", label: "Incenso", icon: "incense" },
  { id: "kits", name: "Kits e Presentes", label: "Kit", icon: "gift" }
];

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
