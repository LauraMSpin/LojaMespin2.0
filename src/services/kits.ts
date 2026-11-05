import { PRODUCTS } from "../data/products";
import { STORE_CONFIG } from "../data/settings";
import type {
  KitGroup,
  KitGroupDetail,
  KitSlot,
  KitUnit,
  KitUnitDetail,
  Product
} from "../types";
import { roundMoney } from "./cart";

export const KIT_CART_STORAGE_KEY = "mespin:kit-cart:v1";

/** Produto com composição cadastrada (`components`) é tratado como kit. */
export const isKit = (product: Product | undefined | null): boolean =>
  Boolean(product?.components && product.components.length > 0);

/** Expande os componentes em seletores individuais ("Vela 1", "Vela 2"). */
export function getSlots(product: Product): KitSlot[] {
  const slots: KitSlot[] = [];
  for (const component of product.components ?? []) {
    const count = Math.max(1, Math.floor(component.quantity));
    for (let i = 1; i <= count; i++) {
      slots.push({
        id: `${component.id}:${i}`,
        componentId: component.id,
        name: count > 1 ? `${component.name} ${i}` : component.name,
        type: component.type,
        description: component.description,
        aroma: component.aroma
      });
    }
  }
  return slots;
}

export const choiceSlots = (product: Product) => getSlots(product).filter((s) => s.aroma.mode === "choice");

const randomId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const makeKitKey = (productId: string) => randomId(`kit-${productId}`);

export function createUnit(selections: Record<string, string> = {}, id?: string): KitUnit {
  return { id: id ?? randomId("u"), selections: { ...selections } };
}

export function createKitGroup(input: { key?: string; productId: string; units: KitUnit[] }): KitGroup {
  return {
    key: input.key ?? makeKitKey(input.productId),
    productId: input.productId,
    units: input.units.map((u) => createUnit(u.selections, u.id))
  };
}

/** Valor do aroma de um seletor: escolhido pelo cliente, definido pelo kit ou nenhum. */
export function slotValue(slot: KitSlot, unit: KitUnit): string | null {
  if (slot.aroma.mode === "fixed") return slot.aroma.value;
  if (slot.aroma.mode === "choice") return unit.selections[slot.id] ?? null;
  return null;
}

/** Pendências de uma unidade, citando o item que falta configurar. */
export function validateUnit(product: Product, unit: KitUnit, label = "Kit"): string[] {
  const errors: string[] = [];
  for (const slot of getSlots(product)) {
    if (slot.aroma.mode !== "choice") continue;
    const chosen = unit.selections[slot.id];
    if (!chosen) errors.push(`${label} — ${slot.name}: selecione o aroma.`);
    else if (!slot.aroma.options.includes(chosen)) errors.push(`${label} — ${slot.name}: aroma indisponível.`);
  }
  return errors;
}

export function validateKitGroup(product: Product, units: KitUnit[], max = STORE_CONFIG.maxKitUnits): string[] {
  if (units.length < 1) return ["Escolha ao menos 1 kit."];
  if (units.length > max) return [`Máximo de ${max} kits por compra.`];
  return units.flatMap((unit, i) => validateUnit(product, unit, `Kit ${i + 1}`));
}

/** True se as escolhas de `unit` são idênticas e completas em relação a `previous`. */
export function matchesPrevious(product: Product, previous: KitUnit | undefined, unit: KitUnit): boolean {
  if (!previous) return false;
  const slots = choiceSlots(product);
  if (slots.length === 0) return false;
  return slots.every((s) => Boolean(unit.selections[s.id]) && unit.selections[s.id] === previous.selections[s.id]);
}

/** Copia as escolhas de `source` para uma unidade nova, mantendo o id da unidade de destino. */
export function copySelections(product: Product, source: KitUnit, targetId: string): KitUnit {
  const selections: Record<string, string> = {};
  for (const slot of choiceSlots(product)) {
    if (source.selections[slot.id]) selections[slot.id] = source.selections[slot.id];
  }
  return createUnit(selections, targetId);
}

export type KitCartAction =
  | { type: "add"; group: KitGroup }
  | { type: "replace"; key: string; group: KitGroup }
  | { type: "removeUnit"; key: string; unitId: string }
  | { type: "removeGroup"; key: string }
  | { type: "clear" }
  | { type: "load"; groups: KitGroup[] };

export function kitCartReducer(state: KitGroup[], action: KitCartAction): KitGroup[] {
  switch (action.type) {
    case "add":
      return [...state, action.group];
    case "replace":
      return state.map((g) => (g.key === action.key ? { ...action.group, key: action.key } : g));
    case "removeUnit":
      return state
        .map((g) => (g.key === action.key ? { ...g, units: g.units.filter((u) => u.id !== action.unitId) } : g))
        .filter((g) => g.units.length > 0);
    case "removeGroup":
      return state.filter((g) => g.key !== action.key);
    case "clear":
      return [];
    case "load":
      return action.groups;
    default:
      return state;
  }
}

/** Valida o que veio do LocalStorage; descarta qualquer coisa inesperada. */
export function parseStoredKitCart(raw: string | null): KitGroup[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const groups: KitGroup[] = [];
    for (const item of data) {
      if (!item || typeof item !== "object") continue;
      const g = item as Partial<KitGroup>;
      if (typeof g.key !== "string" || typeof g.productId !== "string" || !Array.isArray(g.units)) continue;
      const units: KitUnit[] = [];
      for (const u of g.units) {
        if (!u || typeof u !== "object" || typeof u.id !== "string" || !u.selections || typeof u.selections !== "object") continue;
        const selections: Record<string, string> = {};
        for (const [slot, value] of Object.entries(u.selections)) {
          if (typeof value === "string" && value) selections[slot] = value;
        }
        units.push({ id: u.id, selections });
      }
      if (units.length > 0) groups.push({ key: g.key, productId: g.productId, units });
    }
    return groups;
  } catch {
    return [];
  }
}

/** Resolve os grupos com o catálogo atual; descarta kits removidos, esgotados, sem preço ou com escolhas inválidas. */
export function getKitDetails(groups: KitGroup[], products: Product[] = PRODUCTS): KitGroupDetail[] {
  const details: KitGroupDetail[] = [];
  for (const group of groups) {
    const product = products.find((p) => p.id === group.productId);
    if (!product || !isKit(product) || !product.available || product.price === null) continue;
    const slots = getSlots(product);
    const units: KitUnitDetail[] = [];
    for (const unit of group.units) {
      if (validateUnit(product, unit).length > 0) continue;
      units.push({
        unit,
        label: `Kit ${units.length + 1}`,
        items: slots.map((slot) => ({ name: slot.name, value: slotValue(slot, unit) }))
      });
    }
    if (units.length === 0) continue;
    details.push({
      group,
      product,
      units,
      unitPrice: product.price,
      subtotal: roundMoney(product.price * units.length)
    });
  }
  return details;
}

export const kitTotal = (details: KitGroupDetail[]) => roundMoney(details.reduce((sum, d) => sum + d.subtotal, 0));

export const kitUnitCount = (details: KitGroupDetail[]) => details.reduce((sum, d) => sum + d.units.length, 0);
