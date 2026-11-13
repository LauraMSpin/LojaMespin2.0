/**
 * DÚVIDAS FREQUENTES (FAQ do Mespito)
 *
 * - FAQ_MESPITO: textos de apresentação do mascote.
 * - FAQ_ITEMS: perguntas e respostas, na ordem em que aparecem. Cada item precisa de um `id` único.
 *   Para editar, basta mudar o texto; para esconder uma pergunta, apague o item.
 *
 * Respostas já revisadas pela Mespín. Ao incluir novas respostas, confira se estão de acordo com a prática da loja.
 */

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export const FAQ_MESPITO = {
  title: "Dúvidas frequentes",
  /** Frase característica do Mespito. */
  catchphrase: "Oi, eu sou o Mespito! Posso ajudar?",
  intro: "Pergunte à vontade: separei as respostas das dúvidas mais comuns sobre a Mespín.",
  imageAlt: "Mespito, o mascote da Mespín: uma vela acesa de óculos escuros, piscando e sorrindo",
  ctaText: "Não achou sua dúvida?",
  ctaLabel: "Fale com a gente no WhatsApp",
  ctaMessage: "Olá! Vim pelo FAQ do Mespito e tenho uma dúvida."
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "como-pedir",
    q: "Como faço meu pedido?",
    a: "É só escolher os produtos, adicionar ao carrinho e tocar em finalizar. O site monta a mensagem do pedido e abre o WhatsApp para você enviar. A confirmação final é feita por lá, direto com a gente."
  },
  {
    id: "pagamento",
    q: "Como funciona o pagamento?",
    a: "O pagamento é combinado no atendimento pelo WhatsApp, depois de confirmarmos o seu pedido e a disponibilidade. O pagamento pode ser feito por pix e cartão, no momento do fechamento da compra. Para encomendas, solicitamos um adiantamento de 50% no ato da encomenda, e os outros 50% na entrega"
  },
  {
    id: "entrega",
    q: "Vocês entregam em todo o Brasil?",
    a: "Sim! Enviamos para todo o Brasil. O valor do frete depende do seu endereço e é informado no atendimento antes de você fechar o pedido."
  },
  {
    id: "aromas",
    q: "Quais aromas vocês têm?",
    a: "Trabalhamos com Lavanda, Verbena Siciliana, Bambu, Cereja & Macadâmia e Flor de Laranjeira. Em cada produto você vê quais aromas estão disponíveis e escolhe o seu."
  },
  {
    id: "tamanhos",
    q: "Qual a diferença entre a vela de 100g e a de 200g?",
    a: "A de 200g tem o dobro de cera, então rende mais tempo de aroma e de luz. A vela de 100g é ótima para presentear ou para experimentar um aroma novo. Na mesma compra você pode misturar os dois tamanhos."
  },
  {
    id: "refil",
    q: "O que é o refil?",
    a: "É a cera aromática para você reabastecer o seu copo quando a vela acabar, em 100g ou 200g, nos mesmos aromas das velas. Assim você reaproveita o copo e gera menos resíduo."
  },
  {
    id: "artesanal",
    q: "As velas são artesanais?",
    a: "Sim! Cada vela é feita à mão, uma a uma, com muito carinho. Por isso pequenas diferenças de acabamento fazem parte do charme do produto."
  },
  {
    id: "presente",
    q: "Vocês têm opção para presente?",
    a: "Temos! A embalagem é especial para presente, e você pode adicionar uma mensagem ao pedido. Também temos kits e a linha de Natal, que já são pensados para presentear."
  },
  {
    id: "cuidados",
    q: "Como cuidar da minha vela?",
    a: "Na primeira vez, deixe acesa até a cera derreter por toda a superfície, para não “cavar” o centro. Mantenha o pavio com cerca de 5 mm, e nunca deixe a vela acesa sem supervisão, longe de crianças, animais e coisas inflamáveis."
  },
  {
    id: "personalizados",
    q: "Posso personalizar velas e lembrancinhas?",
    a: "Pode sim! Na página Personalizados você escolhe o produto, o aroma e a etiqueta, com nome, data ou mensagem. Cada produto tem uma quantidade mínima, e quantidades maiores podem ter desconto. A produção só começa depois da confirmação com a gente."
  },
  {
    id: "prazo-personalizados",
    q: "Quanto tempo leva uma encomenda personalizada?",
    a: "O prazo depende do produto e da quantidade; ele aparece na página de cada item (por exemplo, 3, 5 ou 7 dias úteis). A previsão final é confirmada no atendimento. O prazo de envio conta depois da produção."
  },
  {
    id: "troca",
    q: "Posso trocar ou devolver?",
    a: "Se algo chegar diferente do esperado, fale com a gente pelo WhatsApp que resolvemos juntos. Produtos personalizados são feitos sob medida, então precisam ser conferidos antes da produção."
  }
];
