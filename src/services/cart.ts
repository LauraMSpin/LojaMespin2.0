import type {
  CartItemDetail,
  CartLine,
  CustomizationField,
  CustomizationValues,
  Product,
  ProductVariant
} from "../types";

export const CART_STORAGE_KEY = "mespin:cart:v1";

export const CUSTOMIZATION_LABELS: Record<CustomizationField, string> = {
  labelName: "Nome para rótulo",
  giftMessage: "Mensagem para presente",
  notes: "Observações"
};

const FIELD_ORDER: CustomizationField[] = ["labelName", "giftMessage", "notes"];

/** Mantém só campos preenchidos, sem espaços sobrando. */
export function cleanCustomization(values: CustomizationValues | undefined): CustomizationValues {
  const result: CustomizationValues = {};
  if (!values) return result;
  for (const field of FIELD_ORDER) {
    const text = values[field]?.trim();
    if (text) result[field] = text;
  }
  return result;
}

export function customizationEntries(
  values: CustomizationValues
): { field: CustomizationField; label: string; value: string }[] {
  return FIELD_ORDER.filter((f) => values[f]).map((f) => ({
    field: f,
    label: CUSTOMIZATION_LABELS[f],
    value: values[f] as string
  }));
}

/** Itens iguais (produto + aroma + personalização) compartilham a mesma chave e são somados. */
export function makeLineKey(
  productId: string,
  aroma: string | null,
  customization: CustomizationValues,
  variantId: string | null = null
): string {
  const custom = FIELD_ORDER.map((f) => `${f}=${customization[f] ?? ""}`).join("&");
  return `${productId}|${aroma ?? ""}|${custom}${variantId ? `|v=${variantId}` : ""}`;
}

/** Menor preço do produto (o da variante mais barata, se houver variantes). */
export function startingPrice(product: Product): number | null {
  if (product.variants && product.variants.length > 0) return Math.min(...product.variants.map((v) => v.price));
  return product.price;
}

export const hasVariants = (product: Product): boolean => (product.variants?.length ?? 0) > 0;

export function findVariant(product: Product, variantId: string | null | undefined): ProductVariant | undefined {
  return product.variants?.find((v) => v.id === variantId);
}

export function createLine(
  productId: string,
  aroma: string | null,
  quantity: number,
  customization: CustomizationValues = {},
  variantId: string | null = null
): CartLine {
  const clean = cleanCustomization(customization);
  return {
    key: makeLineKey(productId, aroma, clean, variantId),
    productId,
    aroma,
    quantity,
    customization: clean,
    ...(variantId ? { variantId } : {})
  };
}

export type CartAction =
  | { type: "add"; lines: CartLine[]; max: number }
  | { type: "setQuantity"; key: string; quantity: number; max: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "replace"; lines: CartLine[] };

const clamp = (value: number, max: number) => Math.min(Math.max(Math.floor(value), 0), max);

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add": {
      let next = state;
      for (const incoming of action.lines) {
        const quantity = clamp(incoming.quantity, action.max);
        if (quantity <= 0) continue;
        const existing = next.find((l) => l.key === incoming.key);
        if (existing) {
          next = next.map((l) =>
            l.key === incoming.key
              ? { ...l, quantity: clamp(l.quantity + quantity, action.max) }
              : l
          );
        } else {
          next = [...next, { ...incoming, quantity }];
        }
      }
      return next;
    }
    case "setQuantity": {
      const quantity = clamp(action.quantity, action.max);
      if (quantity <= 0) return state.filter((l) => l.key !== action.key);
      return state.map((l) => (l.key === action.key ? { ...l, quantity } : l));
    }
    case "remove":
      return state.filter((l) => l.key !== action.key);
    case "clear":
      return [];
    case "replace":
      return action.lines;
    default:
      return state;
  }
}

/** Resolve linhas com os dados atuais do catálogo; ignora produtos removidos, esgotados, sem preço ou kits (têm carrinho próprio). */
export function getCartDetails(lines: CartLine[], products: Product[]): CartItemDetail[] {
  const details: CartItemDetail[] = [];
  for (const line of lines) {
    const product = products.find((p) => p.id === line.productId);
    if (!product || !product.available || product.price === null) continue;
    if (product.components && product.components.length > 0) continue;
    const variant = hasVariants(product) ? findVariant(product, line.variantId) : undefined;
    // Produto com variantes exige uma variante válida; sem ela a linha é ignorada.
    if (hasVariants(product) && !variant) continue;
    const unitPrice = variant ? variant.price : product.price;
    details.push({
      line,
      product,
      ...(variant ? { variant } : {}),
      unitPrice,
      subtotal: roundMoney(unitPrice * line.quantity)
    });
  }
  return details;
}

export function cartTotal(details: CartItemDetail[]): number {
  return roundMoney(details.reduce((sum, d) => sum + d.subtotal, 0));
}

export function cartCount(details: CartItemDetail[]): number {
  return details.reduce((sum, d) => sum + d.line.quantity, 0);
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Valida o que veio do LocalStorage; descarta qualquer coisa inesperada. */
export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const lines: CartLine[] = [];
    for (const item of data) {
      if (
        item &&
        typeof item === "object" &&
        typeof (item as CartLine).productId === "string" &&
        typeof (item as CartLine).quantity === "number" &&
        (item as CartLine).quantity > 0
      ) {
        const { productId, aroma, quantity, customization, variantId } = item as CartLine;
        lines.push(
          createLine(
            productId,
            typeof aroma === "string" ? aroma : null,
            quantity,
            customization && typeof customization === "object" ? customization : {},
            typeof variantId === "string" ? variantId : null
          )
        );
      }
    }
    return lines;
  } catch {
    return [];
  }
}
