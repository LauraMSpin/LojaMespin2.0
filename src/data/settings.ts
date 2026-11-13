import type { HeroSlide } from "../types";

export const STORE_CONFIG = {
  name: "Mespín",
  slogan: "Chamas com Alma",

  /** Formato internacional, só dígitos: 55 + DDD + número. */
  whatsapp: "5531984840078",
  whatsappDisplay: "(31) 98484-0078",
  instagram: "https://www.instagram.com/velasmespin/",
  instagramHandle: "@velasmespin",

  currency: "BRL",
  locale: "pt-BR",

  christmasPageEnabled: true,
  freightLabel: "A combinar",
  maxQuantityPerLine: 99,
  maxKitUnits: 10,
  featuredLimit: 8,

  defaultWhatsAppMessage: "Olá! Gostaria de saber mais sobre os produtos da Mespín. 🕯️",

  footer: {
    description: "Aromas artesanais para transformar seus momentos.",
    orderInfo:
      "Pedidos finalizados pelo WhatsApp. Frete, disponibilidade e pagamento são confirmados no atendimento.",
    craftedMessage: "Feito com carinho",
    contactMessage:
      "Olá! Conheci a Mespín pelo site e gostaria de mais informações sobre os produtos.",
    buttonMessage: "Olá! Gostaria de conhecer melhor os produtos da Mespín."
  },

  topBarMessages: [
    { icon: "truck", text: "Frete para todo o Brasil" },
    { icon: "gift", text: "Embalagem especial para presente" },
    { icon: "leaf", text: "Produtos artesanais e sustentáveis" }
  ],

  about: {
    title: "Sobre a Mespín",
    paragraphs: [
      "A Mespín nasceu do desejo de transformar momentos simples em experiências de aconchego. Cada vela é produzida de forma artesanal, com cuidado em cada detalhe.",
      "Escolhemos os aromas com atenção para criar ambientes acolhedores e para que você tenha opções especiais na hora de presentear quem ama."
    ],
    highlights: [
      { icon: "hand", title: "Produção artesanal", text: "Feitas à mão, uma a uma." },
      { icon: "flower", title: "Aromas escolhidos", text: "Seleção cuidadosa de fragrâncias." },
      { icon: "gift", title: "Para presentear", text: "Embalagem especial para presente." },
      { icon: "heart", title: "Aconchego e bem-estar", text: "Momentos que ficam na memória." }
    ]
  },

  christmas: {
    title: "Um Natal cheio de luz e aconchego",
    description:
      "Presentes aromáticos feitos à mão para tornar os momentos especiais ainda mais inesquecíveis.",
    ctaLabel: "EXPLORAR COLEÇÃO DE NATAL",
    image: "assets/banners/hero-natal.jpg"
  },

  seo: {
    title: "Mespín — Chamas com Alma | Velas e aromatizadores artesanais",
    description:
      "Velas e aromatizadores artesanais para uma casa mais acolhedora. Faça seu pedido pelo WhatsApp."
  }
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-aromas",
    image: "assets/banners/hero-vela.jpg",
    alt: "Vela aromática acesa com pinhas, canela e laranja desidratada",
    title: "Aromas que transformam momentos",
    subtitle: "Velas e aromatizadores artesanais para uma casa mais acolhedora.",
    ctaLabel: "VER CATÁLOGO",
    action: { type: "anchor", id: "catalogo" }
  },
  {
    id: "slide-waxmelts",
    image: "assets/banners/hero-waxmelts.jpg",
    alt: "Embalagens de wax melt Mespín em formato de coração",
    title: "Wax melts Mespín",
    subtitle: "Cera de coco, feitos à mão, em diferentes aromas.",
    ctaLabel: "FALAR NO WHATSAPP",
    action: {
      type: "whatsapp",
      message: "Olá! Gostaria de saber mais sobre os Wax Melts da Mespín. 🕯️"
    }
  },
  {
    id: "slide-velas",
    image: "assets/banners/hero-velas.jpg",
    alt: "Linha de velas aromáticas Mespín com cera de coco",
    title: "Velas aromáticas feitas à mão",
    subtitle: "Cera de coco em aromas como Lavanda, Verbena Siciliana, Bambu e mais.",
    ctaLabel: "VER VELAS",
    layout: "right",
    action: { type: "route", to: "/catalogo?categoria=velas" }
  },
  {
    id: "slide-personalizados",
    image: "assets/banners/hero-personalizados.jpg",
    alt: "Velas e kits personalizados Mespín: vela com monograma, lembrancinha com nome e caixa de presente",
    title: "Presentes únicos, feitos para você",
    subtitle: "Personalize aromas, etiquetas e detalhes para criar lembranças exclusivas.",
    ctaLabel: "CONHECER PERSONALIZADOS",
    layout: "right",
    action: { type: "route", to: "/personalizados" }
  },
  {
    id: "slide-lembrancinhas",
    image: "assets/banners/hero-lembrancinhas.jpg",
    alt: "Lembrancinhas personalizadas Mespín: lata com nome e data, potinho com mensagem e caixa com velas",
    title: "Lembrancinhas com o seu nome",
    subtitle: "Casamentos, aniversários e datas especiais, com nome, data e mensagem.",
    ctaLabel: "PEDIR LEMBRANCINHAS",
    layout: "right",
    action: { type: "route", to: "/personalizados" }
  }
];
