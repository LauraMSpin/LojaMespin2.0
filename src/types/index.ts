export type CategoryId =
  | "velas"
  | "difusores"
  | "sprays"
  | "saches"
  | "incensos"
  | "kits";

export type CustomizationField = "labelName" | "giftMessage" | "notes";

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
