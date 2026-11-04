import {
  Flame,
  Flower2,
  Gift,
  Hand,
  Heart,
  LayoutGrid,
  Leaf,
  ShoppingBag,
  SprayCan,
  TreePine,
  Truck,
  Wind,
  FlaskConical,
  type LucideProps
} from "lucide-react";
import type { ComponentType } from "react";

const MAP: Record<string, ComponentType<LucideProps>> = {
  all: LayoutGrid,
  candle: Flame,
  diffuser: FlaskConical,
  spray: SprayCan,
  sachet: ShoppingBag,
  incense: Wind,
  gift: Gift,
  natal: TreePine,
  truck: Truck,
  leaf: Leaf,
  hand: Hand,
  flower: Flower2,
  heart: Heart
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = MAP[name] ?? Flame;
  return <Component aria-hidden="true" {...props} />;
}
