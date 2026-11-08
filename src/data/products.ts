import type { Product } from "../types";

/**
 * CATÁLOGO DE PRODUTOS
 *
 * Edite este arquivo para cadastrar, alterar ou remover produtos.
 * - price: número em reais (ex.: 32 ou 89.9). Use `null` para "Preço sob consulta".
 * - image: foto principal (caminho dentro de `public/`, ex.: "assets/products/minha-foto.jpg").
 *   Sem imagem, o site exibe um placeholder da marca.
 * - gallery: fotos extras (opcional), ex.: ["assets/products/minha-foto-2.jpg"]. Aparecem como
 *   miniaturas no modal do produto.
 * - variants: tamanhos com preço próprio (ex.: refil), o cliente escolhe um. Ex.:
 *   variants: [{ id: "100g", label: "100g", price: 25 }, { id: "200g", label: "200g", price: 40 }]
 *   Com variants, `price` serve só de referência (use o menor valor); o site mostra "A partir de".
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

const AROMAS_VELAS_NATAL = [
  "Bosque Natalino",
  "Especiarias de Natal",
  "Aconchego do Noel"
];

const ANIMAIS = [
  "Elefante",
  "Leão",
  "Girafa",
  "Lulu da Pomerânia",
  "Shih Tzu",
  "Ovelha"
];

export const PRODUCTS: Product[] = [
  {
    id: "vela-aromatica",
    name: "Vela Aromática",
    category: "velas",
    description: "Vela em copo patê aromatizada, nos tamanhos de 100g e 200g.",
    image: "assets/products/produto-001.jpg",
    gallery: ["assets/products/produto-002.jpg"],
    price: 32,
    variants: [
      { id: "100g", label: "100g", price: 32 },
      { id: "200g", label: "200g", price: 70 }
    ],
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
    description: "Kit com duas velas aromáticas de 100g. Você escolhe o aroma de cada vela.",
    image: "assets/products/produto-003.jpg",
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
    sortOrder: 3
  },
  {
    id: "difusor-cerâmica",
    name: "Difusor de Aromas Cerâmica",
    category: "difusores",
    description: "Difusor elegante em cerâmica.",
    image: "assets/products/produto-004.jpg",
    price: 50,
    aromas: [],
    available: true,
    featured: true,
    isChristmas: false,
    sortOrder: 4
  },
  {
    id: "wax-melt",
    name: "Wax Melts 30g",
    category: "wax-melts",
    description: "Wax melts aromatizados",
    image: "assets/products/produto-005.jpg",
    price: 20,
    aromas: AROMAS_VELAS,
    available: true,
    featured: true,
    isChristmas: false,
    sortOrder: 5
  },
  {
    id: "pets-aromáticos",
    name: "Pets Aromáticos",
    category: "velas",
    description: "Pets aromáticos de Menta & Flor de Lótus para decorar e perfumar o ambiente.",
    price: 18,
    aromas: ANIMAIS,
    image: "assets/products/produto-006.jpg",
    gallery: ["assets/products/produto-006-2.jpg"],
    available: true,
    featured: true,
    isChristmas: false,
    sortOrder: 6
  },
  {
    id: "cartao-postal",
    name: "Cartão Postal",
    category: "velas",
    description: "Cartão postal de natal com latinha para iluminar seu ambiente.",
    price: 8, 
    aromas: AROMAS_VELAS_NATAL,
    image: "assets/products/produto-007.jpg",
    gallery: ["assets/products/produto-007-2.jpg"],
    available: true,
    featured: false,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 7
  },
    {
    id: "pingente-natal",
    name: "Pingente Natal",
    category: "velas",
    description: "Pingente aromatizador com fragrância natalina.",
    price: 12 ,
    aromas: ["Floco de Neve - Aconchego do Noel", "Árvore de Natal - Bosque Natalino", "Biscoito - Especiarias de Natal"],
    image: "assets/products/produto-009.jpg",
    available: true,
    featured: false,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 8
  },
    {
    id: "trio-pingentes",
    name: "Trio Pingentes Natal",
    category: "kits",
    description: "Trio de Pingentes aromatizadores com fragrância natalina.",
    price: 42,
    aromas: [],
    components: [
      {
        id: "pingente",
        name: "Pingente",
        type: "pingente",
        quantity: 3,
        aroma: { mode: "fixed", value: "Bosque Natalino" },
        aromas: [
          { mode: "fixed", value: "Bosque Natalino" },
          { mode: "fixed", value: "Especiarias de Natal" },
          { mode: "fixed", value: "Aconchego do Noel" }
        ]
      }
    ],
    image: "assets/products/produto-011.jpg",
    available: true,
    featured: false,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 9
  },
  {
    id: "wax-melt-natal",
    name: "Wax Melt Natal",
    category: "wax-melts",
    description: "Wax melt aromatizado com fragrância natalina.",
    price: 20,
    aromas: AROMAS_VELAS_NATAL,
    image: "assets/products/produto-012.jpg",
    gallery: ["assets/products/produto-012-2.jpg"],
    available: true,
    featured: false,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 10
  },
  {
    id: "vela-bubble",
    name: "Vela Bubble",
    category: "velas",
    description: "Vela aromatizada em formato bubble.",
    price: 39,
    aromas: [],
    image: "assets/products/produto-013.jpg",
    available: true,
    featured: false,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 11
  },
  {
    id: "kit-mini-velas-natal",
    name: "Kit Mini Velas Natal",
    category: "kits",
    description: "Kit com três mini velas aromáticas de 50g.",
    image: "assets/products/produto-014.jpg",
    price: 70,
    aromas: [],
    components: [
      {
        id: "vela",
        name: "Vela",
        type: "vela",
        quantity: 3,
        aroma: { mode: "fixed", value: "Bosque Natalino" },
        aromas: [
          { mode: "fixed", value: "Bosque Natalino" },
          { mode: "fixed", value: "Especiarias de Natal" },
          { mode: "fixed", value: "Aconchego do Noel" }
        ]
      }
    ],
    available: true,
    featured: true,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 12
  },
  {
    id: "kit-presente-noel-luxury",
    name: "Kit Presente Noel Luxury",
    category: "kits",
    description: "Kit presente natalino para surpreender quem você ama. Contém uma vela aromática de 200g, uma árvore de natal aromática, um kit de fósforos e um abafador",
    price: 150,
        image: "assets/products/produto-015.jpg",
    aromas: ["Golden Christmas"],
    available: true,
    featured: false,
    isChristmas: true,
    badge: "Natal",
    sortOrder: 13
  }
  ,
  {
    id: "difusor-elétrico",
    name: "Difusor Elétrico",
    category: "difusores",
    description: "Difusor elétrico para wax melts e óleos aromáticos.",
    price: 70,
    image: "assets/products/produto-016.jpg",
    aromas: ["Golden Christmas"],
    available: true,
    featured: false,
    isChristmas: false,
    sortOrder: 14
  },
  {
    id: "refil-vela-aromatica",
    name: "Refil de Vela Aromática",
    category: "refil",
    description: "Refil de vela aromática para reutilizar o seu copo. Escolha o tamanho e o aroma.",
    price: 28,
    variants: [
      { id: "100g", label: "100g", price: 28 },
      { id: "200g", label: "200g", price: 52 }
    ],
    aromas: AROMAS_VELAS,
    available: true,
    featured: false,
    isChristmas: false,
    sortOrder: 15
  }
];
