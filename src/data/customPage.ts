/** Conteúdo da página Personalizados (banner, galeria, processo e perguntas frequentes). */

export const CUSTOM_PAGE = {
  enabled: true,

  hero: {
    title: "Presentes únicos, feitos especialmente para você.",
    description:
      "Transformamos suas ideias em lembranças especiais. Personalize aromas, embalagens e detalhes para criar produtos exclusivos para seus momentos.",
    ctaLabel: "CONHECER PERSONALIZADOS",
    collage: [
      { image: "assets/personalizados/velas-coracao-emanuelle.jpg", alt: "Vela em formato de corações ao lado de embalagem com etiqueta personalizada" },
      { image: "assets/personalizados/vela-monograma.jpg", alt: "Vela em copo com monograma dourado e ilustração personalizada" },
      { image: "assets/personalizados/vela-gamer-angela.jpg", alt: "Vela em pote com rótulo personalizado com o nome Angela" },
      { image: "assets/personalizados/kit-presente-caixa.jpg", alt: "Kit presente em caixa de madeira com vela e caixinha ilustrada" }
    ]
  },

  intro: {
    title: "Feito sob encomenda, do seu jeito",
    text: "Escolha o produto, os aromas e os detalhes de personalização. Depois, envie sua solicitação pelo WhatsApp e converse com a equipe Mespín para confirmar arte, prazo, frete e condições."
  },

  gallery: {
    title: "Trabalhos realizados",
    intro: "Alguns exemplos de personalizações feitas pela Mespín.",
    items: [
      { image: "assets/personalizados/vela-carneirinho.jpg", alt: "Vela em formato de carneirinho sobre mesa de madeira" },
      { image: "assets/personalizados/vela-monograma.jpg", alt: "Vela em copo de vidro com tampa de madeira e monograma dourado com flores e paisagem" },
      { image: "assets/personalizados/kit-presente-caixa.jpg", alt: "Caixa de madeira com palha contendo caixinha ilustrada, vela e lembrancinhas embaladas" },
      { image: "assets/personalizados/velas-coracao-emanuelle.jpg", alt: "Vela em formato de corações ao lado de embalagem de celofane com laço vermelho e etiqueta com o nome Emanuelle" },
      { image: "assets/personalizados/vela-gamer-angela.jpg", alt: "Vela em pote com tampa de madeira e rótulo temático com o nome Angela" },
      { image: "assets/personalizados/lata-ligia.jpg", alt: "Latinha estampada com etiqueta dourada com o nome Ligia, ao lado de vela em formato de corações" }
    ]
  },

  process: {
    title: "Como funciona sua encomenda?",
    steps: [
      { icon: "search", title: "Escolha seu produto", text: "Navegue pelas opções de personalizados e escolha o produto desejado." },
      { icon: "pen", title: "Personalize", text: "Informe quantidade, aromas, cores, etiquetas e demais detalhes disponíveis." },
      { icon: "chat", title: "Solicite seu orçamento", text: "Envie sua solicitação pelo WhatsApp e converse com a equipe Mespín." },
      { icon: "check", title: "Aprove sua encomenda", text: "A arte, os detalhes finais, o prazo e as condições comerciais serão confirmados antes do início da produção." }
    ]
  },

  faq: {
    title: "Dúvidas frequentes",
    items: [
      { q: "Existe quantidade mínima para encomendar?", a: "Sim. Cada produto possui uma quantidade mínima específica, informada na página do produto." },
      { q: "Posso escolher os aromas?", a: "Sim, quando essa opção estiver disponível para o produto selecionado." },
      { q: "Posso enviar minha própria arte?", a: "Sim. Você poderá informar que possui uma referência e encaminhá-la diretamente pelo WhatsApp." },
      { q: "Existem descontos para grandes quantidades?", a: "Alguns produtos podem ter descontos progressivos conforme a quantidade solicitada. Quando houver, eles aparecem na página do produto." },
      { q: "Quanto tempo demora a produção?", a: "O prazo varia conforme o produto, a quantidade e o nível de personalização. A previsão será confirmada no atendimento." },
      { q: "Como faço meu pedido?", a: "Escolha o produto, informe as personalizações e envie sua solicitação pelo WhatsApp." }
    ]
  },

  cta: {
    title: "Vamos criar algo especial?",
    text: "Conte sua ideia para a equipe Mespín e receba um orçamento.",
    buttonLabel: "Falar no WhatsApp",
    message: "Olá! Gostaria de saber mais sobre os produtos personalizados da Mespín. 🕯️"
  },

  home: {
    title: "Presentes únicos, feitos especialmente para você.",
    text: "Personalize aromas, etiquetas e detalhes para criar lembranças exclusivas.",
    ctaLabel: "Conhecer personalizados",
    images: [
      "assets/personalizados/velas-coracao-emanuelle.jpg",
      "assets/personalizados/vela-monograma.jpg",
      "assets/personalizados/kit-presente-caixa.jpg"
    ]
  }
};
