import type { Product } from "../types";

/**
 * CATÁLOGO DE PRODUTOS
 *
 * Edite este arquivo para cadastrar, alterar ou remover produtos.
 * - price: número em reais (ex.: 32 ou 89.9). Use `null` para "Preço sob consulta".
 * - image: caminho dentro de `public/` (ex.: "assets/products/minha-foto.jpg").
 *   Sem imagem, o site exibe um placeholder da marca.
 * - aromas: lista de aromas. Lista vazia = produto sem escolha de aroma.
 * - customization: { fields: ["labelName", "giftMessage", "notes"] } habilita campos de texto.
 * - components: composição de um kit (lista de itens). Cada item tem id, name, type, quantity e aroma
 *   ({ mode: "choice", options: [...] } | { mode: "fixed", value } | { mode: "none" }). quantity 2 gera
 *   dois seletores independentes (Vela 1, Vela 2). O kit custa o price do produto.
 *
 * Itens marcados com "PENDENTE" ainda aguardam dados oficiais (preço/foto/aromas).
 */

const AROMAS_VELAS = [
  "Lavanda",
  "Verbena Siciliana",
  "Bambu",
  "Cereja & Macadâmia",
  "Flor de Laranjeira"
];

export const PRODUCTS: Product[] = [
  {
    id: "vela-aromatica-100g",
    name: "Vela Aromática 100g",
    category: "velas",
    description: "Vela em copo patê com 100g aromatizada.",
    image: "assets/products/vela-aromatica-100g.jpg",
    price: 32,
    aromas: AROMAS_VELAS,
    available: true,
    featured: true,
    isChristmas: false,
    sortOrder: 1
  },
  {
    id: "kit-vela-dupla",
    name: "Kit Vela Dupla",
    category: "kits",
    description: "Kit com duas velas aromáticas. Você escolhe o aroma de cada vela.",
    image: "assets/products/kit-vela-dupla.jpg",
    price: 70,
    aromas: [],
    components: [
      {
        id: "vela",
        name: "Vela",
        type: "vela",
        quantity: 2,
        aroma: { mode: "choice", options: AROMAS_VELAS }
      }
    ],
    available: true,
    featured: true,
    isChristmas: false,
    sortOrder: 2
  },
  {
    id: "difusor-aromas-berco-rosa",
    name: "Difusor de Aromas Berço Rosa",
    category: "difusores",
    description: "Difusor elegante em formato de berço com essências variadas.",
    price: 89.9, // PENDENTE: foto e aromas
    aromas: [],
    available: true,
    featured: true,
    isChristmas: false,
    sortOrder: 3
  },
  {
    id: "kit-velas-natalinas-especial",
    name: "Kit Velas Natalinas Especial",
    category: "kits",
    description: "Kit com 3 velas natalinas: Pinha, Canela e Hibisco.",
    price: 149.9, // PENDENTE: foto
    aromas: [],
    available: true,
    featured: true,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 4
  },
  {
    id: "aromatizador-spray-citrico",
    name: "Aromatizador Spray Cítrico",
    category: "sprays",
    description: "Spray aromatizador com essência cítrica refrescante.",
    price: 39.9, // PENDENTE: foto
    aromas: [],
    available: true,
    featured: true,
    isChristmas: false,
    sortOrder: 5
  },
  {
    id: "vela-flutuante-ouro-natal",
    name: "Vela Flutuante Ouro Natal",
    category: "velas",
    description: "Vela flutuante dourada com essência de Ouro e Madeira - Edição Natal.",
    price: 79.9, // PENDENTE: foto
    aromas: [],
    available: true,
    featured: true,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 6
  },
  {
    id: "aromatizador-ambiente-eucalipto",
    name: "Aromatizador Ambiente Eucalipto",
    category: "sprays",
    description: "Aromatizador de ambiente com essência de eucalipto.",
    price: null, // PENDENTE: preço e foto
    aromas: [],
    available: true,
    featured: false,
    isChristmas: false,
    sortOrder: 7
  },
  {
    id: "difusor-ultrassonico-premium",
    name: "Difusor Ultrassônico Premium",
    category: "difusores",
    description: "Difusor ultrassônico para aromatizar o ambiente.",
    price: null, // PENDENTE: preço e foto
    aromas: [],
    available: true,
    featured: false,
    isChristmas: false,
    sortOrder: 8
  },
  {
    id: "incenso-aromatico-almiscar",
    name: "Incenso Aromático Almíscar",
    category: "incensos",
    description: "Incenso aromático com fragrância de almíscar.",
    price: null, // PENDENTE: preço e foto
    aromas: [],
    available: true,
    featured: false,
    isChristmas: false,
    sortOrder: 9
  },
  {
    id: "vela-aromatica-chocolate-natalina",
    name: "Vela Aromática Chocolate Natalina",
    category: "velas",
    description: "Vela aromática com fragrância de chocolate - Edição Natal.",
    price: null, // PENDENTE: preço e foto
    aromas: [],
    available: true,
    featured: false,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 10
  },
  {
    id: "aromatizador-sache-floresta",
    name: "Aromatizador Sachê Floresta",
    category: "saches",
    description: "Sachê aromatizador com fragrância de floresta.",
    price: null, // PENDENTE: preço e foto
    aromas: [],
    available: true,
    featured: false,
    isChristmas: false,
    sortOrder: 11
  },
  {
    id: "kit-presente-noel-luxury",
    name: "Kit Presente Noël Luxury",
    category: "kits",
    description: "Kit presente natalino para surpreender quem você ama.",
    price: null, // PENDENTE: preço e foto
    aromas: [],
    available: true,
    featured: false,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 12
  }
];
