import { CUSTOM_PRODUCTS, CUSTOM_RULES } from "../data/customProducts";
import { PRODUCTS } from "../data/products";
import type {
  BoxItem,
  CustomBoxItemDetail,
  CustomLabel,
  CustomLabelField,
  CustomLine,
  CustomOrderDetail,
  CustomProduct,
  CustomUnit,
  Product
} from "../types";

export const CUSTOM_CART_STORAGE_KEY = "mespin:custom-cart:v1";

export const LABEL_FIELD_INFO: Record<
  CustomLabelField,
  { label: string; placeholder: string; maxLength: number; multiline: boolean }
> = {
  names: { label: "Nome ou nomes", placeholder: "Ex.: Maria e Eduardo", maxLength: 80, multiline: false },
  date: { label: "Data", placeholder: "Ex.: 15/05/2027", maxLength: 30, multiline: false },
  message: { label: "Frase ou mensagem", placeholder: "Mensagem que aparecerá na etiqueta", maxLength: 200, multiline: true }
};

export const TEXT_LIMITS = { packaging: 120, notes: 300 };

const LABEL_ORDER: CustomLabelField[] = ["names", "date", "message"];

export const toCents = (reais: number) => Math.round(reais * 100);

export function cleanLabel(label: CustomLabel | undefined): CustomLabel {
  const result: CustomLabel = {};
  if (!label) return result;
  for (const field of LABEL_ORDER) {
    const text = label[field]?.trim().slice(0, LABEL_FIELD_INFO[field].maxLength);
    if (text) result[field] = text;
  }
  return result;
}

export interface NewCustomLine {
  key?: string;
  productId: string;
  units: CustomUnit[];
  label?: CustomLabel;
  packaging?: string;
  hasReference?: boolean;
  notes?: string;
  boxItems?: BoxItem[];
}

export function makeCustomKey(productId: string): string {
  return `custom-${productId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createCustomLine(input: NewCustomLine): CustomLine {
  return {
    key: input.key ?? makeCustomKey(input.productId),
    productId: input.productId,
    units: input.units.filter((u) => u.quantity > 0).map((u) => ({ aroma: u.aroma, quantity: Math.floor(u.quantity) })),
    label: cleanLabel(input.label),
    packaging: (input.packaging ?? "").trim().slice(0, TEXT_LIMITS.packaging),
    hasReference: Boolean(input.hasReference),
    notes: (input.notes ?? "").trim().slice(0, TEXT_LIMITS.notes),
    boxItems: (input.boxItems ?? [])
      .filter((i) => i.quantity > 0)
      .map((i) => ({ source: i.source, refId: i.refId, aroma: i.aroma, quantity: Math.floor(i.quantity) }))
  };
}

export const totalQuantity = (line: CustomLine) => line.units.reduce((sum, u) => sum + u.quantity, 0);

/** Maior faixa aplicável à quantidade (sem somar faixas), limitada pelo teto configurado. */
export function discountFor(product: CustomProduct, quantity: number): number {
  let percent = 0;
  let tierMin = -1;
  for (const tier of product.discountTiers) {
    if (quantity >= tier.minQuantity && tier.minQuantity > tierMin) {
      percent = tier.discount;
      tierMin = tier.minQuantity;
    }
  }
  return Math.min(Math.max(percent, 0), CUSTOM_RULES.maxDiscountPercent);
}

export function activeTier(product: CustomProduct, quantity: number) {
  let result: CustomProduct["discountTiers"][number] | null = null;
  for (const tier of product.discountTiers) {
    if (quantity >= tier.minQuantity && (!result || tier.minQuantity > result.minQuantity)) result = tier;
  }
  return result;
}

export interface BoxSource {
  source: "catalog" | "custom";
  refId: string;
  name: string;
  priceCents: number | null;
  aromas: string[];
}

/** Itens que podem entrar na caixa: catálogo (exceto kits) e personalizados unitários. */
export function getBoxSources(
  catalog: Product[] = PRODUCTS,
  customProducts: CustomProduct[] = CUSTOM_PRODUCTS
): BoxSource[] {
  const fromCatalog: BoxSource[] = catalog
    .filter((p) => p.available && p.category !== "kits")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => ({
      source: "catalog",
      refId: p.id,
      name: p.name,
      priceCents: p.price === null ? null : toCents(p.price),
      aromas: p.aromas
    }));
  const fromCustom: BoxSource[] = customProducts
    .filter((p) => p.available && p.kind === "unit")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => ({
      source: "custom",
      refId: p.id,
      name: p.name,
      priceCents: p.basePrice === null ? null : toCents(p.basePrice),
      aromas: p.options.aromas
    }));
  return [...fromCatalog, ...fromCustom];
}

export function computeCustomOrder(
  line: CustomLine,
  product: CustomProduct,
  sources: BoxSource[] = getBoxSources()
): CustomOrderDetail {
  const quantity = totalQuantity(line);
  const boxItems: CustomBoxItemDetail[] = [];
  const pendingItems: string[] = [];
  let itemsCents = 0;

  if (product.kind === "box") {
    for (const item of line.boxItems) {
      const src = sources.find((s) => s.source === item.source && s.refId === item.refId);
      if (!src) continue;
      boxItems.push({ name: src.name, aroma: item.aroma, quantity: item.quantity, priceCents: src.priceCents });
      if (src.priceCents === null) pendingItems.push(src.name);
      else itemsCents += src.priceCents * item.quantity;
    }
  }

  const baseCents = product.basePrice === null ? null : toCents(product.basePrice);
  const unitCents = baseCents === null ? null : baseCents + itemsCents;
  const discountPercent = unitCents === null ? 0 : discountFor(product, quantity);
  const finalUnitCents =
    unitCents === null ? null : Math.round((unitCents * (100 - discountPercent)) / 100);
  const subtotalCents = finalUnitCents === null ? null : finalUnitCents * quantity;
  const savingsCents = unitCents === null || finalUnitCents === null ? 0 : (unitCents - finalUnitCents) * quantity;

  return {
    line,
    product,
    totalQuantity: quantity,
    unitCents,
    discountPercent,
    finalUnitCents,
    subtotalCents,
    savingsCents,
    isFrom: Boolean(product.priceFrom) || pendingItems.length > 0,
    boxItems,
    pendingItems
  };
}

/** Resolve as encomendas com o cadastro atual; ignora produtos removidos ou indisponíveis. */
export function getCustomDetails(
  lines: CustomLine[],
  customProducts: CustomProduct[] = CUSTOM_PRODUCTS,
  catalog: Product[] = PRODUCTS
): CustomOrderDetail[] {
  const sources = getBoxSources(catalog, customProducts);
  const details: CustomOrderDetail[] = [];
  for (const line of lines) {
    const product = customProducts.find((p) => p.id === line.productId);
    if (!product || !product.available) continue;
    details.push(computeCustomOrder(line, product, sources));
  }
  return details;
}

export function customTotalCents(details: CustomOrderDetail[]): number {
  return details.reduce((sum, d) => sum + (d.subtotalCents ?? 0), 0);
}

/** True quando o total é estimativa: há "a partir de" ou itens/produtos sem valor. */
export function customHasPending(details: CustomOrderDetail[]): boolean {
  return details.some((d) => d.subtotalCents === null || d.isFrom);
}

/** Regras de quantidade mínima, incremento e limite; devolve mensagens para o cliente. */
export function validateCustomLine(line: CustomLine, product: CustomProduct): string[] {
  const errors: string[] = [];
  const { minimumQuantity: min, quantityStep: step } = product;
  const max = CUSTOM_RULES.maxQuantity;
  const stepOk = (q: number) => step <= 1 || (q - min) % step === 0;
  const unitWord = (n: number) => (n === 1 ? "unidade" : "unidades");

  if (product.kind === "box") {
    const boxes = totalQuantity(line);
    if (boxes < min) errors.push(`Quantidade mínima de caixas: ${min}.`);
    if (boxes > max) errors.push(`Quantidade máxima por encomenda: ${max}.`);
    if (!stepOk(boxes)) errors.push(`A quantidade deve aumentar de ${step} em ${step}.`);
    if (line.boxItems.length === 0) errors.push("Escolha ao menos um item para a caixa.");
    return errors;
  }

  if (line.units.length === 0) {
    errors.push(
      product.options.aromas.length > 0
        ? `Escolha ao menos um aroma com no mínimo ${min} ${unitWord(min)}.`
        : `Quantidade mínima: ${min} ${unitWord(min)}.`
    );
    return errors;
  }

  if (product.minimumScope === "total") {
    const total = totalQuantity(line);
    if (total < min) errors.push(`Quantidade mínima para este produto: ${min} ${unitWord(min)}.`);
  }
  for (const unit of line.units) {
    const name = unit.aroma ?? product.name;
    if (product.options.aromas.length > 0 && (!unit.aroma || !product.options.aromas.includes(unit.aroma))) {
      errors.push("Aroma indisponível para este produto.");
      continue;
    }
    if (product.minimumScope === "perAroma" && unit.quantity < min) {
      errors.push(`${name}: mínimo de ${min} ${unitWord(min)} por aroma.`);
    }
    if (unit.quantity > max) errors.push(`${name}: máximo de ${max} unidades.`);
    if (!stepOk(unit.quantity)) errors.push(`${name}: a quantidade deve aumentar de ${step} em ${step}.`);
  }
  return errors;
}

export type CustomCartAction =
  | { type: "add"; line: CustomLine }
  | { type: "replace"; key: string; line: CustomLine }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "load"; lines: CustomLine[] };

export function customCartReducer(state: CustomLine[], action: CustomCartAction): CustomLine[] {
  switch (action.type) {
    case "add":
      return [...state, action.line];
    case "replace":
      return state.map((l) => (l.key === action.key ? { ...action.line, key: action.key } : l));
    case "remove":
      return state.filter((l) => l.key !== action.key);
    case "clear":
      return [];
    case "load":
      return action.lines;
    default:
      return state;
  }
}

const isPositiveInt = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n > 0;

/** Valida o que veio do LocalStorage; descarta qualquer coisa inesperada. */
export function parseStoredCustomCart(raw: string | null): CustomLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const lines: CustomLine[] = [];
    for (const item of data) {
      if (!item || typeof item !== "object") continue;
      const l = item as Partial<CustomLine>;
      if (typeof l.key !== "string" || typeof l.productId !== "string" || !Array.isArray(l.units)) continue;
      const units = l.units
        .filter((u): u is CustomUnit => !!u && isPositiveInt((u as CustomUnit).quantity))
        .map((u) => ({ aroma: typeof u.aroma === "string" ? u.aroma : null, quantity: u.quantity }));
      if (units.length === 0) continue;
      const boxItems = (Array.isArray(l.boxItems) ? l.boxItems : [])
        .filter(
          (b): b is BoxItem =>
            !!b &&
            (b.source === "catalog" || b.source === "custom") &&
            typeof b.refId === "string" &&
            isPositiveInt(b.quantity)
        )
        .map((b) => ({ source: b.source, refId: b.refId, aroma: typeof b.aroma === "string" ? b.aroma : null, quantity: b.quantity }));
      lines.push(
        createCustomLine({
          key: l.key,
          productId: l.productId,
          units,
          label: l.label && typeof l.label === "object" ? l.label : {},
          packaging: typeof l.packaging === "string" ? l.packaging : "",
          hasReference: l.hasReference === true,
          notes: typeof l.notes === "string" ? l.notes : "",
          boxItems
        })
      );
    }
    return lines;
  } catch {
    return [];
  }
}
