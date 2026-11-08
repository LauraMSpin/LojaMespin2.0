import type { Category } from "../types";

export const CATEGORIES: Category[] = [
  { id: "velas", name: "Velas", label: "Vela", icon: "candle" },
  { id: "difusores", name: "Difusores", label: "Difusor", icon: "diffuser" },
  { id: "saches", name: "Sachês", label: "Sachê", icon: "sachet" },
  { id: "wax-melts", name: "Wax Melts", label: "Wax Melt", icon: "wax" },
  { id: "refil", name: "Refil", label: "Refil", icon: "refill" },
  { id: "kits", name: "Kits e Presentes", label: "Kit", icon: "gift" }
];

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
