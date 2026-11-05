# ESPECIFICAÇÃO FUNCIONAL — PÁGINA DE PRODUTOS PERSONALIZADOS MESPÍN

**Projeto:** Mespín — Chamas com Alma  
**Módulo:** Personalizados  
**Tecnologia:** React + TypeScript  
**Hospedagem:** GitHub Pages  
**Backend:** Não utilizar  
**Integração de pedidos:** WhatsApp

---

# 1. OBJETIVO

Desenvolver uma página independente chamada **Personalizados**, destinada à apresentação e comercialização de produtos artesanais produzidos sob encomenda e que permitem personalização conforme as necessidades do cliente.

Diferentemente dos produtos convencionais do catálogo, os personalizados possuem regras específicas:

- São produzidos sob encomenda.
- Possuem quantidade mínima de pedido.
- Podem oferecer diferentes opções de personalização.
- Podem exigir aprovação prévia de arte ou modelo.
- Podem possuir prazos de produção diferenciados.
- Podem oferecer descontos progressivos conforme a quantidade solicitada.

O cliente deverá conseguir conhecer as opções disponíveis, visualizar exemplos de trabalhos já realizados, selecionar o produto, informar as características desejadas e solicitar um orçamento ou realizar seu pedido pelo WhatsApp.

**Não haverá backend.** Todos os produtos, quantidades mínimas, faixas de desconto, opções de personalização e informações comerciais deverão ser configurados no frontend.

# 2. REFERÊNCIAS VISUAIS E IDENTIDADE DA MARCA

A página deverá seguir rigorosamente o padrão visual das páginas já existentes da Mespín.

Utilizar como referência:

- Página inicial.
- Página exclusiva de Natal.
- Catálogo de produtos.
- Identidade visual oficial da marca.
- Rodapé institucional.
- Tipografia e componentes já implementados.

Não criar uma identidade visual diferente para a página de personalizados.

A experiência deverá parecer parte natural do mesmo e-commerce.

### Paleta de cores

- Marrom profundo: `#3E2723`.
- Terracota: `#B7410E`.
- Bege: `#D2B48C`.
- Creme: `#F5F5DC`.
- Off-white: `#FAF0E6`.
- Caramelo: `#C19A6B`.
- Marrom avermelhado: `#A0522D`.
- Verde-oliva: `#6B8E23`.

Utilizar títulos serifados elegantes, textos em sans-serif e elementos decorativos botânicos discretos.

# 3. NOVA OPÇÃO NO MENU PRINCIPAL

Adicionar uma nova opção chamada **Personalizados** ao menu principal da loja.

Ordem sugerida:

1. Início.
2. Catálogo.
3. Personalizados.
4. Natal.
5. Sobre.
6. Contato.

O item deverá direcionar para uma página independente.

Rota sugerida:

`#/personalizados`

A navegação deverá funcionar em desktop e dispositivos móveis.

Adicionar também o link "Personalizados" ao rodapé institucional, na coluna de navegação.

# 4. PÁGINA PERSONALIZADOS

A página deverá possuir estrutura semelhante às demais páginas da loja, com:

1. Cabeçalho global.
2. Banner principal.
3. Apresentação institucional.
4. Categorias de personalizados.
5. Catálogo de produtos sob encomenda.
6. Galeria de trabalhos realizados.
7. Explicação sobre o processo de encomenda.
8. Dúvidas frequentes.
9. Chamada para atendimento pelo WhatsApp.
10. Rodapé global.

# 5. BANNER PRINCIPAL

Criar um banner amplo e elegante, seguindo o padrão visual dos banners já existentes.

O banner deverá transmitir exclusividade, cuidado artesanal e possibilidades de personalização.

### Imagens de referência

Utilizar as fotografias reais dos produtos personalizados já produzidos pela Mespín.

As imagens estarão disponíveis na pasta:

`Assets/Personalizados`

O agente deverá:

- Inspecionar todos os arquivos dessa pasta.
- Identificar as fotografias disponíveis.
- Selecionar imagens representativas para o banner.
- Utilizar imagens reais dos produtos da marca.
- Não substituir as fotografias por imagens genéricas.
- Preservar a qualidade e a proporção das imagens.
- Criar uma composição visual harmônica.

As fotografias poderão ser utilizadas em uma composição de banner, com diferentes produtos personalizados apresentados em conjunto.

O banner deverá possuir espaço adequado para o texto, sem prejudicar a visualização dos produtos.

### Texto do banner

Título:

**Presentes únicos, feitos especialmente para você.**

Descrição:

"Transformamos suas ideias em lembranças especiais. Personalize aromas, embalagens e detalhes para criar produtos exclusivos para seus momentos."

Botão:

**CONHECER PERSONALIZADOS**

O botão deverá direcionar para a grade de produtos da página.

### Animações

Seguir o padrão das outras páginas:

- Fade-in dos textos.
- Entrada suave do banner.
- Zoom lento e discreto na imagem.
- Hover nos botões.
- Respeitar `prefers-reduced-motion`.

Não utilizar animações excessivas.

# 6. CATEGORIAS DE PERSONALIZADOS

Criar uma área para apresentar os diferentes tipos de produtos disponíveis para personalização.

As categorias deverão ser dinâmicas, configuráveis e vinculadas aos produtos cadastrados.

Exemplos de categorias que poderão ser utilizadas, desde que existam produtos correspondentes:

- Lembranças de casamento.
- Lembranças de aniversário.
- Maternidade e chá de bebê.
- Eventos corporativos.
- Presentes personalizados.
- Kits especiais.
- Lembranças para padrinhos.
- Datas comemorativas.

Cada categoria deverá possuir:

- Nome.
- Descrição.
- Imagem ilustrativa, quando disponível.
- Identificador.
- Ordem de exibição.

Ao clicar em uma categoria, filtrar os produtos correspondentes.

Não criar categorias vazias ou apresentar opções sem produtos cadastrados.

# 7. CATÁLOGO DE PRODUTOS PERSONALIZADOS

Criar uma grade própria para os produtos sob encomenda.

O visual deverá seguir o mesmo padrão dos cartões utilizados no catálogo principal.

Cada cartão deverá apresentar:

- Fotografia do produto.
- Nome.
- Categoria.
- Descrição resumida.
- Quantidade mínima.
- Informação de personalização.
- Indicação de desconto por quantidade, quando aplicável.
- Botão "Personalizar".

Exemplo de apresentação:

**Lembrança Aromática Personalizada**

Mini vela aromática com embalagem e etiqueta personalizadas para eventos especiais.

- Quantidade mínima: 20 unidades.
- Personalização de etiqueta.
- Escolha de aroma.
- Descontos para pedidos maiores.

Botão: **PERSONALIZAR**

Os valores e as quantidades do exemplo são ilustrativos. Os dados definitivos deverão ser configurados no arquivo de produtos.

# 8. CONFIGURAÇÃO DOS PRODUTOS

Criar uma estrutura específica para os produtos personalizados, separada dos produtos convencionais, mas integrada à mesma arquitetura de dados da loja.

Arquivo sugerido:

`src/data/customProducts.ts`

Cada produto deverá possuir os seguintes campos:

| Campo | Descrição |
|---|---|
| id | Identificador único |
| name | Nome do produto |
| category | Categoria |
| description | Descrição comercial |
| image | Imagem principal |
| gallery | Galeria de imagens |
| available | Disponibilidade para encomenda |
| minimumQuantity | Quantidade mínima |
| quantityStep | Incremento permitido, quando aplicável |
| basePrice | Preço unitário de referência |
| discountTiers | Faixas de desconto |
| customizationOptions | Opções de personalização |
| productionTime | Prazo estimado de produção |
| featured | Produto em destaque |
| sortOrder | Ordem de exibição |

Todos os valores deverão ser configuráveis sem necessidade de modificar os componentes React.

# 9. QUANTIDADE MÍNIMA DE PEDIDO

Cada produto deverá possuir uma quantidade mínima independente.

Exemplos:

- Produto A: mínimo de 20 unidades.
- Produto B: mínimo de 30 unidades.
- Produto C: mínimo de 50 unidades.

Os valores acima são apenas exemplos de configuração.

O sistema deverá utilizar a quantidade mínima cadastrada para cada produto.

### Regras

1. O cliente não poderá solicitar quantidade inferior ao mínimo.
2. O controle de quantidade deverá iniciar na quantidade mínima.
3. A quantidade deverá respeitar o incremento configurado, quando houver.
4. O sistema deverá informar claramente a quantidade mínima antes de o cliente iniciar a personalização.
5. A validação deverá acontecer antes de adicionar o produto à solicitação de orçamento.
6. A mensagem enviada pelo WhatsApp deverá informar a quantidade escolhida.

Exemplo:

"Quantidade mínima para este produto: 30 unidades."

Não utilizar uma quantidade mínima global. Cada produto terá sua própria regra.

# 10. DESCONTOS PROGRESSIVOS POR QUANTIDADE

O sistema deverá permitir configurar descontos conforme a quantidade solicitada.

A finalidade é incentivar pedidos maiores, apresentando ao cliente a economia obtida ao aumentar a quantidade.

Cada produto poderá possuir suas próprias faixas de desconto.

### Exemplo ilustrativo

| Quantidade | Desconto |
|---|---:|
| 20 a 49 unidades | 0% |
| 50 a 99 unidades | 5% |
| 100 a 199 unidades | 10% |
| 200 unidades ou mais | 15% |

Esses valores são somente exemplos. Não devem ser cadastrados como condições comerciais reais sem confirmação da proprietária.

### Funcionamento

Ao alterar a quantidade:

1. Identificar a faixa de desconto aplicável.
2. Calcular o preço unitário com desconto.
3. Calcular o subtotal.
4. Apresentar o desconto aplicado.
5. Atualizar automaticamente o resumo do pedido.

Exemplo:

Preço unitário: R$ 10,00.

Quantidade: 100 unidades.

Desconto: 10%.

Preço unitário com desconto: R$ 9,00.

Subtotal: R$ 900,00.

Economia: R$ 100,00.

### Regras importantes

- O desconto deverá ser configurado individualmente por produto.
- O sistema deverá utilizar a maior faixa aplicável à quantidade selecionada.
- Não somar descontos de diferentes faixas.
- Não permitir descontos negativos.
- Não permitir descontos superiores ao limite configurado.
- Exibir claramente o preço original e o preço com desconto.
- Se não houver desconto cadastrado, não exibir uma promoção fictícia.

Os cálculos deverão utilizar valores monetários em centavos internamente, evitando erros de arredondamento.

# 11. MODAL DE PERSONALIZAÇÃO

Ao clicar em "Personalizar", abrir um modal ou uma página de configuração do produto.

O objetivo é permitir que o cliente informe todas as características desejadas para a encomenda.

O layout deverá seguir o padrão dos modais existentes da Mespín.

### 11.1. Informações do produto

Apresentar:

- Fotografia do produto.
- Nome.
- Descrição.
- Preço unitário de referência.
- Quantidade mínima.
- Prazo estimado de produção.
- Informações sobre descontos.

### 11.2. Quantidade

Disponibilizar:

- Botão de diminuir.
- Campo numérico.
- Botão de aumentar.

O campo deverá iniciar na quantidade mínima.

Não permitir valores inferiores ao mínimo.

Ao alterar a quantidade, recalcular automaticamente os valores.

### 11.3. Opções de personalização

As opções deverão ser configuráveis por produto.

Exemplos:

**Aroma**
- Seleção entre os aromas disponíveis.
- Permitir múltiplas opções quando o produto aceitar combinações.
- Informar quantidade por aroma quando necessário.

**Etiqueta**
- Escolha entre modelos disponíveis.
- Possibilidade de enviar um texto personalizado.
- Nome do evento ou dos homenageados.
- Data do evento.
- Mensagem especial.

**Embalagem**
- Seleção de modelos disponíveis.
- Escolha de cores, quando aplicável.
- Opções de acabamento, quando oferecidas.

**Outras personalizações**
- Campos de texto.
- Seleções predefinidas.
- Observações adicionais.

Não apresentar campos que não sejam aplicáveis ao produto.

Cada produto deverá determinar quais opções de personalização estarão disponíveis.

### 11.4. Texto personalizado

Quando o produto permitir, disponibilizar campos como:

- Nome ou nomes.
- Data.
- Frase ou mensagem.
- Observações.

Adicionar limites de caracteres e indicação visual da quantidade de caracteres restantes.

Não solicitar informações desnecessárias.

### 11.5. Referência visual do cliente

Permitir que o cliente informe se possui uma referência visual ou uma arte própria.

Como não haverá backend, não implementar upload de arquivos para armazenamento permanente.

Em vez disso, disponibilizar a opção:

"Tenho uma imagem ou referência para enviar."

Quando selecionada, incluir essa informação no pedido e orientar o cliente a encaminhar o arquivo diretamente pelo WhatsApp.

# 12. CÁLCULO DO ORÇAMENTO

O sistema deverá apresentar um resumo dinâmico conforme o cliente personaliza o produto.

Exibir:

- Produto.
- Quantidade.
- Personalizações escolhidas.
- Preço unitário.
- Faixa de desconto.
- Valor do desconto.
- Subtotal.

Exemplo:

**Resumo da encomenda**

Produto: Mini Vela Personalizada

Quantidade: 100 unidades

Personalização:
- Aroma: Lavanda.
- Etiqueta: Personalizada.
- Mensagem: Maria e Eduardo.

Valores:
- Preço unitário: R$ 10,00.
- Desconto aplicado: 10%.
- Preço unitário final: R$ 9,00.
- Subtotal: R$ 900,00.

O valor apresentado deverá ser identificado como estimativa quando depender de aprovação de arte, embalagem especial ou confirmação comercial.

Caso o preço não esteja definido no cadastro do produto, o sistema deverá exibir:

"Solicite um orçamento."

Não inventar preços.

# 13. CARRINHO DE PERSONALIZADOS

Os produtos personalizados deverão possuir um fluxo de encomenda próprio, mas integrado ao carrinho geral da loja.

Ao adicionar uma personalização, armazenar:

- Identificador do produto.
- Nome do produto.
- Imagem.
- Quantidade.
- Preço de referência.
- Desconto aplicado.
- Aroma.
- Opções de personalização.
- Texto personalizado.
- Observações.
- Subtotal estimado.

### Regras

- Cada configuração diferente deverá ser tratada como um item independente.
- Não misturar duas personalizações distintas automaticamente.
- Permitir editar uma encomenda adicionada.
- Permitir remover a encomenda.
- Atualizar os valores após qualquer alteração.
- Preservar as informações ao navegar entre páginas.

Utilizar o mesmo estado global do carrinho, mas identificar claramente os itens como produtos personalizados.

Exemplo de identificação:

`Tipo: Produto sob encomenda`

# 14. FINALIZAÇÃO PELO WHATSAPP

Os personalizados deverão ser incluídos no fluxo de pedidos pelo WhatsApp já utilizado pela loja.

Ao finalizar, gerar uma mensagem com todos os detalhes da encomenda.

### Exemplo de mensagem

Olá! Gostaria de solicitar um orçamento de produtos personalizados da Mespín! 🕯️

*DADOS DO CLIENTE*

Nome: Maria Silva.

*PRODUTO PERSONALIZADO*

Produto: Mini Vela Aromática Personalizada.

Quantidade: 100 unidades.

*PERSONALIZAÇÃO*

Aroma: Lavanda.

Etiqueta: Personalizada.

Texto: Maria e Eduardo — 15/05/2027.

Embalagem: Modelo escolhido.

Observações: Lembrança para casamento.

*VALORES ESTIMADOS*

Preço unitário: R$ 10,00.

Desconto: 10%.

Preço unitário com desconto: R$ 9,00.

Subtotal estimado: R$ 900,00.

Gostaria de receber informações sobre prazo de produção, frete e aprovação da arte.

Obrigada!

### Regras

- Utilizar o mesmo número de WhatsApp configurado na loja.
- Codificar corretamente a mensagem.
- Preservar todos os dados da personalização.
- Permitir pedidos com mais de um produto personalizado.
- Incluir o nome e o CEP do cliente, quando preenchidos no checkout geral.
- Não limpar o carrinho antes da abertura do WhatsApp.
- Não declarar que o pedido foi recebido ou aprovado automaticamente.

O atendimento deverá confirmar a disponibilidade, a arte, o prazo, o frete e as condições finais.

# 15. GALERIA DE TRABALHOS REALIZADOS

Criar uma seção visual com fotografias de produtos personalizados já produzidos pela Mespín.

Utilizar as imagens presentes na pasta:

`Assets/Personalizados`

Essa pasta deverá ser inspecionada integralmente pelo agente.

### Objetivo

Apresentar exemplos reais de personalizações e inspirar novos pedidos.

### Apresentação

Criar uma galeria em grade ou composição estilo editorial.

As imagens deverão:

- Ter boa resolução.
- Preservar a proporção.
- Possuir cantos arredondados.
- Ter espaçamento uniforme.
- Utilizar efeitos discretos de hover.
- Abrir em visualização ampliada ao clicar, quando apropriado.

Não recortar partes importantes dos produtos.

### Organização

Quando for possível identificar os tipos de produtos pelas imagens ou por informações existentes, organizar por categorias.

Exemplos:

- Casamentos.
- Aniversários.
- Eventos.
- Presentes.
- Corporativo.

Não inventar o contexto de uma fotografia quando ele não estiver identificado.

A galeria deverá ser configurada por arquivos locais do projeto.

Não utilizar serviços externos de hospedagem de imagens.

# 16. PROCESSO DE ENCOMENDA

Criar uma seção explicando de forma simples como funciona a compra de personalizados.

Título:

**Como funciona sua encomenda?**

Apresentar quatro etapas:

**1. Escolha seu produto**

Navegue pelas opções de personalizados e escolha o produto desejado.

**2. Personalize**

Informe quantidade, aromas, cores, etiquetas e demais detalhes disponíveis.

**3. Solicite seu orçamento**

Envie sua solicitação pelo WhatsApp e converse com a equipe Mespín.

**4. Aprove sua encomenda**

A arte, os detalhes finais, o prazo e as condições comerciais serão confirmados antes do início da produção.

Utilizar ícones delicados e uma apresentação visual coerente com o restante da página.

# 17. DESCONTOS E QUANTIDADES — COMUNICAÇÃO VISUAL

É importante deixar claro que pedidos maiores podem proporcionar condições comerciais melhores.

Nos cartões dos produtos, quando houver descontos cadastrados, apresentar uma indicação como:

"Descontos progressivos para grandes quantidades."

No modal, apresentar as faixas de desconto em uma tabela ou lista compacta.

Destacar a faixa correspondente à quantidade selecionada.

Exemplo:

- 20 unidades: preço padrão.
- 50 unidades: 5% de desconto.
- 100 unidades: 10% de desconto.
- 200 unidades: 15% de desconto.

Os exemplos não representam preços ou descontos comerciais definitivos.

Não apresentar descontos quando não houver faixas configuradas.

# 18. PRAZOS E PRODUÇÃO SOB ENCOMENDA

Cada produto poderá possuir um prazo estimado de produção configurável.

Exemplo de apresentação:

"Prazo estimado de produção: 15 dias úteis."

O prazo deverá ser específico de cada produto.

Se o prazo não estiver cadastrado, apresentar:

"Prazo de produção a confirmar pelo atendimento."

Não calcular automaticamente datas de entrega nem prometer prazos não confirmados.

Deixar claro que a produção somente será iniciada após confirmação das condições e aprovação necessárias.

# 19. DÚVIDAS FREQUENTES

Adicionar uma seção de perguntas frequentes em formato de acordeão.

Perguntas sugeridas:

**Existe quantidade mínima para encomendar?**

Sim. Cada produto possui uma quantidade mínima específica, informada na página do produto.

**Posso escolher os aromas?**

Sim, quando essa opção estiver disponível para o produto selecionado.

**Posso enviar minha própria arte?**

Sim. Você poderá informar que possui uma referência e encaminhá-la diretamente pelo WhatsApp.

**Existem descontos para grandes quantidades?**

Sim. Alguns produtos possuem descontos progressivos conforme a quantidade solicitada.

**Quanto tempo demora a produção?**

O prazo varia conforme o produto, a quantidade e o nível de personalização. A previsão será confirmada no atendimento.

**Como faço meu pedido?**

Escolha o produto, informe as personalizações e envie sua solicitação pelo WhatsApp.

As respostas deverão ser configuráveis e poderão ser ajustadas futuramente.

# 20. CONFIGURAÇÃO CENTRALIZADA

Criar um arquivo específico para os produtos personalizados.

Sugestão:

`src/data/customProducts.ts`

Criar também estruturas tipadas para:

- Produtos personalizados.
- Quantidade mínima.
- Faixas de desconto.
- Opções de personalização.
- Galerias.
- Categorias.

Exemplo ilustrativo:

```typescript
{
  id: "mini-vela-personalizada",
  name: "Mini Vela Personalizada",
  category: "casamentos",
  description: "Mini vela aromática para lembranças.",
  image: "/Assets/Personalizados/mini-vela.jpg",

  available: true,

  minimumQuantity: 20,

  quantityStep: 1,

  basePrice: 10.00,

  discountTiers: [
    { minQuantity: 50, discount: 5 },
    { minQuantity: 100, discount: 10 },
    { minQuantity: 200, discount: 15 }
  ],

  customizationOptions: {
    aromas: true,
    label: true,
    customText: true,
    packaging: true,
    referenceImage: true
  },

  productionTime: "15 dias úteis",

  featured: true
}
```

Esse cadastro é apenas um exemplo estrutural. Os produtos reais e seus dados deverão ser definidos com base nas informações disponíveis.

# 21. RESPONSIVIDADE

A página deverá seguir os mesmos padrões responsivos das demais páginas.

Validar:

- Desktop: 1440px.
- Notebook: 1024px.
- Tablet: 768px.
- Celular: 390px.
- Celular compacto: 360px.

### Desktop

- Banner amplo.
- Grade com múltiplas colunas.
- Modal de personalização em duas colunas.
- Galeria editorial.
- Seções bem distribuídas.

### Celular

- Banner adaptado.
- Categorias com navegação horizontal quando necessário.
- Produtos em uma ou duas colunas conforme a largura.
- Modal adaptado para uma coluna.
- Campos de personalização acessíveis.
- Botões com áreas de toque adequadas.
- Resumo do pedido fácil de visualizar.
- WhatsApp acessível.

Não permitir rolagem horizontal involuntária.

# 22. ACESSIBILIDADE E DESEMPENHO

- Utilizar HTML semântico.
- Adicionar textos alternativos às fotografias.
- Garantir contraste.
- Permitir navegação por teclado.
- Exibir foco visível.
- Otimizar imagens.
- Utilizar carregamento lazy nas imagens da galeria.
- Evitar dependências desnecessárias.
- Respeitar `prefers-reduced-motion`.
- Não utilizar animações que prejudiquem a navegação.

# 23. INTEGRAÇÃO COM O RESTANTE DA LOJA

A página de personalizados deverá utilizar os componentes e configurações já existentes.

Reutilizar:

- Cabeçalho.
- Rodapé.
- Identidade visual.
- Sistema de navegação.
- Carrinho global.
- Contexto de armazenamento.
- Configuração do WhatsApp.
- Componentes de botões.
- Formatação monetária.

Não criar um segundo sistema de carrinho ou uma integração WhatsApp independente.

A diferença deverá estar nas regras de negócio dos produtos personalizados.

O carrinho deverá distinguir produtos convencionais de produtos sob encomenda, preservando as respectivas informações.

# 24. LIMITAÇÕES DO FRONTEND

Como o sistema não possui backend:

- Não haverá envio de arquivos para armazenamento permanente.
- Não haverá aprovação automática de artes.
- Não haverá controle de estoque em tempo real.
- Não haverá confirmação automática de pedidos.
- Não haverá painel administrativo.
- Não haverá cálculo automático de frete por transportadora.
- Não haverá registro centralizado das encomendas.

O cliente enviará a solicitação pelo WhatsApp, e a equipe da Mespín continuará o atendimento manualmente.

Todos os produtos, imagens, quantidades mínimas, preços e descontos serão atualizados nos arquivos de configuração e publicados novamente.

# 25. CRITÉRIOS DE ACEITAÇÃO

- [ ] Nova opção Personalizados no menu principal.
- [ ] Página independente em `#/personalizados`.
- [ ] Link Personalizados no rodapé.
- [ ] Banner com fotografias da pasta `Assets/Personalizados`.
- [ ] Banner coerente com as páginas existentes.
- [ ] Categorias configuráveis.
- [ ] Catálogo exclusivo de produtos sob encomenda.
- [ ] Cartões com quantidade mínima.
- [ ] Modal de personalização.
- [ ] Opções de aromas e embalagens.
- [ ] Campos de texto personalizado.
- [ ] Quantidade mínima validada individualmente.
- [ ] Descontos progressivos configuráveis por produto.
- [ ] Cálculo automático do desconto.
- [ ] Exibição da economia obtida.
- [ ] Prazo estimado de produção.
- [ ] Resumo do pedido.
- [ ] Integração com o carrinho global.
- [ ] Integração com WhatsApp.
- [ ] Galeria de trabalhos realizados.
- [ ] Seção explicando o processo de encomenda.
- [ ] Perguntas frequentes.
- [ ] Layout responsivo.
- [ ] Compatibilidade com GitHub Pages.
- [ ] Documentação para cadastrar novos personalizados.

# 26. ORDEM DE IMPLEMENTAÇÃO

**Fase 1 — Análise**
- Inspecionar o projeto.
- Identificar o padrão das páginas existentes.
- Analisar todas as imagens de `Assets/Personalizados`.
- Identificar os componentes reutilizáveis.

**Fase 2 — Página**
- Criar a rota.
- Adicionar opção ao menu.
- Criar banner.
- Criar categorias.
- Criar catálogo.

**Fase 3 — Personalização**
- Criar estrutura dos produtos.
- Implementar quantidade mínima.
- Implementar faixas de desconto.
- Criar modal de personalização.
- Implementar cálculo de valores.

**Fase 4 — Pedido**
- Integrar ao carrinho global.
- Implementar resumo.
- Integrar ao WhatsApp.

**Fase 5 — Conteúdo**
- Criar galeria.
- Criar processo de encomenda.
- Criar perguntas frequentes.

**Fase 6 — Validação**
- Testar regras de quantidade mínima.
- Testar todas as faixas de desconto.
- Testar personalizações.
- Testar carrinho.
- Testar WhatsApp.
- Validar responsividade.

# 27. ORIENTAÇÕES FINAIS AO AGENTE

Implemente a página diretamente no projeto React existente.

Antes de iniciar, analise a arquitetura atual e reutilize os componentes disponíveis.

A pasta `Assets/Personalizados` deverá ser inspecionada para identificar as fotografias reais dos produtos já produzidos pela Mespín. Essas imagens devem compor o banner e a galeria da página.

Não invente produtos, preços, quantidades mínimas, descontos ou prazos comerciais. Quando não houver informação disponível, deixe o campo configurável e apresente a informação como pendente de confirmação, sem criar condições fictícias.

A página deverá seguir o mesmo padrão visual e estrutural das páginas já existentes.

Não modificar indevidamente as páginas inicial, Natal ou catálogo.

Ao concluir, apresentar:
- Arquivos criados e modificados.
- Produtos cadastrados.
- Imagens utilizadas.
- Regras de quantidade mínima.
- Faixas de desconto configuradas.
- Funcionalidades implementadas.
- Testes executados.
- Instruções para cadastrar novos produtos personalizados.

# 28. DECISÕES DE PROJETO (ESCLARECIMENTOS)

Estas decisões complementam e, em caso de conflito, prevalecem sobre as seções anteriores.

1. **Produtos cadastrados (4 tipos):**
   - Latinhas Personalizadas: R$ 6,00 cada, mínimo de 10 unidades **por aroma**.
   - Potinho 30 ml: R$ 11,00 cada, mínimo de 10 unidades **por aroma**.
   - Copinho 50 ml: R$ 21,00 cada, mínimo de 5 unidades **por aroma**.
   - Caixa Personalizada: a partir de R$ 30,00, mínimo de 1 caixa. O cliente escolhe os itens (catálogo, exceto kits, e os outros personalizados) e o valor de cada item soma ao da caixa. Item sem preço cadastrado entra como "valor a combinar" e o total fica "a partir de".
2. **Descontos e prazos:** sem faixas de desconto e sem prazo cadastrados (o prazo aparece como "a confirmar pelo atendimento") até a proprietária informar os valores reais.
3. **Categorias:** sem categorias por enquanto; apenas a grade de produtos.
4. **Aromas:** os 5 já usados na loja. Etiqueta com nome(s), data e mensagem. Embalagem e modelos como "a combinar" (campo de texto livre).
5. **Carrinho:** único e compartilhado; produtos comuns e personalizados podem ser misturados. Produtos personalizados sem preço (`basePrice: null`) entram como "Solicite um orçamento". A mensagem do WhatsApp tem seções separadas ("MEU PEDIDO" e "PRODUTOS PERSONALIZADOS").
6. **Limite de quantidade:** 999 por aroma (ou por encomenda de caixas) nos personalizados; os produtos comuns continuam em 99.
7. **Banner:** colagem única com 3 a 4 fotos de `Assets/personalizados` e o texto à esquerda. As fotos entram também na galeria. As fotos não viram produtos.
8. **Home:** recebe um destaque curto levando a `#/personalizados`, além do item no menu e no rodapé.

**RESULTADO FINAL ESPERADO**

Uma página independente de produtos personalizados da Mespín, visualmente integrada à loja, que permita aos clientes conhecer produtos feitos sob encomenda, visualizar trabalhos anteriores, escolher personalizações, informar quantidades respeitando os mínimos, obter descontos progressivos e encaminhar solicitações completas pelo WhatsApp.