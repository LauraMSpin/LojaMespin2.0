export type CategoryId =
  | "velas"
  | "difusores"
  | "saches"
  | "wax-melts"
  | "kits";

export type CustomizationField = "labelName" | "giftMessage" | "notes";

/** Aroma de um componente de kit: o cliente escolhe, o kit já define ou não se aplica. */
export type KitAroma =
  | { mode: "choice"; options: string[] }
  | { mode: "fixed"; value: string }
  | { mode: "none" };

/** Item que compõe um kit. `quantity` > 1 gera um seletor independente por unidade ("Vela 1", "Vela 2"). */
export interface KitComponent {
  id: string;
  name: string;
  type: string;
  quantity: number;
  description?: string;
  /** Aroma de todas as unidades do componente (a menos que `aromas` defina um por unidade). */
  aroma: KitAroma;
  /** Opcional: um aroma por unidade (1ª posição = "Vela 1", 2ª = "Vela 2"...). Unidades sem entrada usam `aroma`. */
  aromas?: KitAroma[];
}

export interface KitSlot {
  /** `${componentId}:${n}`, estável para o carrinho. */
  id: string;
  componentId: string;
  name: string;
  type: string;
  description?: string;
  aroma: KitAroma;
}

export interface KitUnit {
  id: string;
  /** slotId → aroma escolhido (apenas slots com `mode: "choice"`). */
  selections: Record<string, string>;
}

/** Uma adição de kits ao carrinho; cada unidade tem a sua própria configuração. */
export interface KitGroup {
  key: string;
  productId: string;
  units: KitUnit[];
}

export interface KitUnitItem {
  name: string;
  /** Aroma escolhido ou definido pelo kit; `null` quando o componente não tem aroma. */
  value: string | null;
}

export interface KitUnitDetail {
  unit: KitUnit;
  /** "Kit 1", "Kit 2"... */
  label: string;
  items: KitUnitItem[];
}

export interface KitGroupDetail {
  group: KitGroup;
  product: Product;
  units: KitUnitDetail[];
  unitPrice: number;
  subtotal: number;
}

export interface Category {
  id: CategoryId;
  /** Nome no plural, usado na navegação por categorias. */
  name: string;
  /** Nome no singular, usado no cartão do produto. */
  label: string;
  icon: string;
}

export interface Customization {
  /** Campos de texto que o cliente pode preencher para este produto. */
  fields: CustomizationField[];
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  /** Caminho relativo a `public/` (ex.: "assets/products/foto.jpg"). Vazio = placeholder de marca. */
  image?: string;
  gallery?: string[];
  /** Preço atual em reais. `null` = preço sob consulta (pedido via WhatsApp). */
  price: number | null;
  originalPrice?: number;
  aromas: string[];
  available: boolean;
  featured: boolean;
  isChristmas: boolean;
  badge?: string;
  customization?: Customization;
  /** Composição do kit. Quando presente, o produto é um kit com escolha por componente. */
  components?: KitComponent[];
  sortOrder: number;
}

export type CustomizationValues = Partial<Record<CustomizationField, string>>;

export interface CartLine {
  key: string;
  productId: string;
  aroma: string | null;
  quantity: number;
  customization: CustomizationValues;
}

export interface CartItemDetail {
  line: CartLine;
  product: Product;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerData {
  name: string;
  cep: string;
}

export type CustomLabelField = "names" | "date" | "message";

export interface CustomDiscountTier {
  minQuantity: number;
  /** Percentual de desconto (ex.: 10 = 10%). */
  discount: number;
}

export interface CustomProduct {
  id: string;
  name: string;
  description: string;
  /** Caminho relativo a `public/`. Vazio = placeholder de marca. */
  image?: string;
  gallery?: string[];
  /** "unit": itens por aroma. "box": caixa montada com itens escolhidos pelo cliente. */
  kind: "unit" | "box";
  available: boolean;
  minimumQuantity: number;
  /** "perAroma": o mínimo vale para cada aroma escolhido. "total": vale para o total. */
  minimumScope: "perAroma" | "total";
  quantityStep: number;
  /** Preço unitário em reais. `null` = "Solicite um orçamento". */
  basePrice: number | null;
  /** Exibe "A partir de" (ex.: caixa, cujo valor soma os itens). */
  priceFrom?: boolean;
  discountTiers: CustomDiscountTier[];
  options: {
    aromas: string[];
    labelFields: CustomLabelField[];
    packaging: boolean;
    referenceImage: boolean;
    notes: boolean;
  };
  /** Ex.: "15 dias úteis". Vazio = "a confirmar pelo atendimento". */
  productionTime?: string;
  featured: boolean;
  sortOrder: number;
}

export type CustomLabel = Partial<Record<CustomLabelField, string>>;

export interface CustomUnit {
  aroma: string | null;
  quantity: number;
}

export interface BoxItem {
  source: "catalog" | "custom";
  refId: string;
  aroma: string | null;
  quantity: number;
}

/** Encomenda personalizada no carrinho; cada configuração é um item independente. */
export interface CustomLine {
  key: string;
  productId: string;
  units: CustomUnit[];
  label: CustomLabel;
  packaging: string;
  hasReference: boolean;
  notes: string;
  boxItems: BoxItem[];
}

export interface CustomBoxItemDetail {
  name: string;
  aroma: string | null;
  quantity: number;
  priceCents: number | null;
}

export interface CustomOrderDetail {
  line: CustomLine;
  product: CustomProduct;
  totalQuantity: number;
  /** Preço unitário (ou da caixa) antes do desconto. */
  unitCents: number | null;
  discountPercent: number;
  finalUnitCents: number | null;
  subtotalCents: number | null;
  savingsCents: number;
  /** Valor exibido como "a partir de". */
  isFrom: boolean;
  boxItems: CustomBoxItemDetail[];
  /** Itens da caixa sem preço cadastrado (valor a combinar). */
  pendingItems: string[];
}

export type SlideAction =
  | { type: "anchor"; id: string }
  | { type: "route"; to: string }
  | { type: "whatsapp"; message: string };

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  action: SlideAction;
  alt: string;
  /** "right": foto ocupa só a parte direita, com fundo marrom à esquerda para o texto. */
  layout?: "full" | "right";
}
