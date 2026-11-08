import {
  BadgeCheck,
  Flame,
  Flower2,
  Gift,
  Hand,
  Heart,
  LayoutGrid,
  Leaf,
  PenLine,
  Search,
  ShoppingBag,
  SprayCan,
  TreePine,
  Truck,
  Wind,
  FlaskConical,
  MessageCircle,
  Recycle,
  Sparkles,
  type LucideProps
} from "lucide-react";
import type { ComponentType } from "react";

const MAP: Record<string, ComponentType<LucideProps>> = {
  all: LayoutGrid,
  candle: Flame,
  diffuser: FlaskConical,
  spray: SprayCan,
  sachet: ShoppingBag,
  refill: Recycle,
  incense: Wind,
  gift: Gift,
  natal: TreePine,
  truck: Truck,
  leaf: Leaf,
  hand: Hand,
  flower: Flower2,
  heart: Heart,
  search: Search,
  pen: PenLine,
  chat: MessageCircle,
  check: BadgeCheck,
  sparkles: Sparkles
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = MAP[name] ?? Flame;
  return <Component aria-hidden="true" {...props} />;
}
