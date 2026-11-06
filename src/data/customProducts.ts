import type { CustomProduct } from "../types";

/**
 * PRODUTOS PERSONALIZADOS (sob encomenda)
 *
 * - basePrice: reais por unidade. `null` = "Solicite um orçamento".
 * - minimumQuantity + minimumScope: "perAroma" = mínimo para cada aroma escolhido;
 *   "total" = mínimo para o total do pedido.
 * - discountTiers: faixas de desconto por quantidade total. Vazio = sem desconto
 *   (exemplo: [{ minQuantity: 50, discount: 5 }, { minQuantity: 100, discount: 10 }]).
 *   Só cadastre descontos confirmados.
 * - productionTime: ex. "15 dias úteis". Vazio = "a confirmar pelo atendimento".
 * - image: foto principal, caminho dentro de `public/` (ex.: "assets/personalizados/foto.jpg").
 *   Sem imagem, o site mostra o placeholder da marca.
 * - gallery: fotos extras (opcional), ex.: ["assets/personalizados/foto-2.jpg"]. Aparecem como
 *   miniaturas ao abrir o produto.
 */

export const CUSTOM_RULES = {
  /** Limite de unidades por aroma (ou de caixas) em uma encomenda. */
  maxQuantity: 999,
  /** Teto de desconto aceito, mesmo que o cadastro informe mais. */
  maxDiscountPercent: 50
};

const AROMAS = [
  "Lavanda",
  "Verbena Siciliana",
  "Bambu",
  "Cereja & Macadâmia",
  "Flor de Laranjeira"
];

const UNIT_OPTIONS = {
  aromas: AROMAS,
  labelFields: ["names", "date", "message"] as CustomProduct["options"]["labelFields"],
  packaging: true,
  referenceImage: true,
  notes: true
};

export const CUSTOM_PRODUCTS: CustomProduct[] = [
  {
    id: "latinhas-personalizadas",
    name: "Latinhas Personalizadas",
    description: "Latinhas aromáticas com etiqueta personalizada, ideais para lembranças.",
    kind: "unit",
    available: true,
    minimumQuantity: 10,
    minimumScope: "perAroma",
    quantityStep: 1,
    basePrice: 6,
    discountTiers: [{ minQuantity: 50, discount: 5 }, { minQuantity: 100, discount: 10 }],
    options: UNIT_OPTIONS,
    featured: true,
    sortOrder: 1,
    image: "assets/personalizados/latinhas.jpg",
    productionTime: "5 dias úteis"
  },
  {
    id: "potinho-30ml-personalizado",
    name: "Potinho 30 ml Personalizado",
    description: "Potinho de 30 ml com aroma e etiqueta personalizados.",
    kind: "unit",
    available: true,
    minimumQuantity: 10,
    minimumScope: "perAroma",
    quantityStep: 1,
    basePrice: 11,
    discountTiers: [{ minQuantity: 20, discount: 5 }, { minQuantity: 50, discount: 8 }],
    options: UNIT_OPTIONS,
    featured: true,
    image: "assets/personalizados/potinho.jpg",
    productionTime: "7 dias úteis",
    sortOrder: 2
  },
  {
    id: "copinho-50ml-personalizado",
    name: "Copinho 50 ml Personalizado",
    description: "Copinho de 50 ml com aroma e etiqueta personalizados.",
    kind: "unit",
    available: true,
    minimumQuantity: 5,
    minimumScope: "perAroma",
    quantityStep: 1,
    basePrice: 21,
    discountTiers: [{ minQuantity: 10, discount: 5 }, { minQuantity: 20, discount: 8 }],
    options: UNIT_OPTIONS,
    featured: true,
    image: "assets/personalizados/copinho.jpg",
    productionTime: "7 dias úteis",
    sortOrder: 3
  },
  {
    id: "caixa-personalizada",
    name: "Caixa Personalizada",
    description:
      "Monte sua caixa escolhendo os itens. O valor parte de R$ 30,00 e cada item adicionado soma ao total.",
    kind: "box",
    available: true,
    minimumQuantity: 1,
    minimumScope: "total",
    quantityStep: 1,
    basePrice: 30,
    priceFrom: true,
    discountTiers: [],
    image: "assets/personalizados/caixa.jpg",
    options: {
      aromas: [],
      labelFields: ["message"],
      packaging: true,
      referenceImage: true,
      notes: true
    },
    featured: true,
    productionTime: "3 dias úteis",
    sortOrder: 4
  }
];
