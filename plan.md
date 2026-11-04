# ESPECIFICAÇÃO FUNCIONAL E TÉCNICA
# E-commerce Mespín — Chamas com Alma

**Versão:** 1.0  
**Tipo de projeto:** Loja virtual estática  
**Frontend:** React + TypeScript  
**Build:** Vite  
**Backend:** Não utilizar  
**Hospedagem:** GitHub Pages  
**Integração de pedidos:** WhatsApp  
**Persistência:** LocalStorage do navegador

---

# 1. OBJETIVO DO PROJETO

Desenvolver uma loja virtual completa para a marca Mespín, especializada em velas aromáticas, difusores, aromatizadores e presentes artesanais.

O sistema deve proporcionar uma experiência de compra elegante, intuitiva, responsiva e visualmente sofisticada, permitindo que os clientes:

1. Visualizem os produtos disponíveis.
2. Pesquisem e filtrem produtos.
3. Consultem detalhes, imagens, preços e descrições.
4. Escolham aromas e quantidades.
5. Adicionem produtos ao carrinho.
6. Personalizem suas escolhas quando aplicável.
7. Informem seus dados para identificação do pedido.
8. Finalizem a compra pelo WhatsApp.

**Não haverá backend, banco de dados ou painel administrativo.** Toda a configuração dos produtos, categorias, preços, imagens, campanhas e informações comerciais será realizada no próprio frontend, por meio de arquivos de configuração.

O sistema deverá funcionar integralmente como aplicação estática, sem necessidade de servidor próprio.

# 2. IDENTIDADE VISUAL DA MESPÍN

A identidade visual deverá ser baseada na imagem de referência presente na raiz do repositório:

`Mespín_ Aromas que Transformam Momentos.png`

Essa imagem deverá ser analisada antes do desenvolvimento e utilizada como referência principal para reproduzir a identidade visual do site.

Não utilizar templates genéricos de e-commerce.

## 2.1. Logotipo

Utilizar o logotipo original da Mespín, caso esteja disponível entre os arquivos do repositório.

Não redesenhar, distorcer, alterar as proporções ou substituir o logotipo por uma versão genérica.

Slogan oficial:

**Chamas com Alma**

## 2.2. Paleta de cores

Utilizar as seguintes cores oficiais:

| Cor | Código | Aplicação |
|---|---|---|
| Marrom profundo | `#3E2723` | Cabeçalhos, textos e botões |
| Terracota | `#B7410E` | Destaques e detalhes |
| Bege amadeirado | `#D2B48C` | Fundos e elementos secundários |
| Verde acinzentado | `#8F9970` | Detalhes naturais |
| Creme | `#F5F5DC` | Fundos suaves |
| Off-white | `#FAF0E6` | Fundo principal |
| Marrom avermelhado | `#A0522D` | Destaques |
| Caramelo | `#C19A6B` | Botões e elementos decorativos |
| Verde-oliva | `#6B8E23` | Detalhes botânicos |
| Verde escuro | `#153109` | Elementos de contraste |

A interface deverá transmitir:

- Sofisticação.
- Aconchego.
- Natureza.
- Artesanato.
- Exclusividade.
- Elegância.

## 2.3. Tipografia

Combinar:

- Fonte serifada elegante para títulos, nomes de produtos e preços.
- Fonte sans-serif para descrições, navegação, botões e formulários.

Sugestões: Cormorant Garamond ou Playfair Display para títulos e Lato ou Montserrat para textos.

# 3. ARQUITETURA DA APLICAÇÃO

## 3.1. Tecnologias

Utilizar:

- React.
- TypeScript.
- Vite.
- React Router.
- CSS Modules ou CSS organizado por componentes.
- Lucide React para ícones.
- LocalStorage para persistência do carrinho.

Evitar dependências desnecessárias.

## 3.2. Estrutura sugerida

Organizar o projeto de maneira modular:

```text
mespin/
│
├── public/
│   ├── assets/
│   │   ├── logo/
│   │   ├── banners/
│   │   ├── products/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Hero/
│   │   ├── ProductCard/
│   │   ├── ProductModal/
│   │   ├── CategoryNavigation/
│   │   ├── CartDrawer/
│   │   ├── CartItem/
│   │   ├── SearchBar/
│   │   └── WhatsAppButton/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Christmas/
│   │   ├── Catalog/
│   │   └── NotFound/
│   │
│   ├── context/
│   │   └── CartContext.tsx
│   │
│   ├── hooks/
│   │   └── useCart.ts
│   │
│   ├── data/
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   └── settings.ts
│   │
│   ├── services/
│   │   └── whatsapp.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── responsive.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

A estrutura pode ser adaptada conforme a necessidade, mas deve manter a separação entre componentes, páginas, dados e regras de negócio.

# 4. CONFIGURAÇÕES CENTRALIZADAS

Como não haverá backend, todas as informações comerciais deverão ficar centralizadas em arquivos de configuração.

Criar um arquivo `settings.ts` contendo:

- Nome da loja.
- Slogan.
- Número de WhatsApp.
- Instagram.
- Telefone comercial, se aplicável.
- Mensagem padrão de atendimento.
- Informações de frete.
- Configurações de campanhas.
- Configurações de exibição de categorias.
- Informações institucionais.

Exemplo:

```typescript
export const STORE_CONFIG = {
  name: "Mespín",
  slogan: "Chamas com Alma",

  whatsapp: "5500000000000",

  instagram: "https://www.instagram.com/velasmespin/",

  currency: "BRL",

  locale: "pt-BR",

  freeShipping: false,

  christmasPageEnabled: true
};
```

O número de WhatsApp deverá ser substituído pelo número comercial real antes da publicação.

Não inventar telefone, endereço ou informações comerciais.

# 5. PÁGINAS DO SISTEMA

O sistema deverá possuir páginas independentes.

## 5.1. Página inicial — `/`

<badge color="success">Página principal</badge>

A página inicial deverá apresentar a marca e permitir que o cliente encontre rapidamente os produtos.

### A. Barra superior

Exibir uma faixa estreita com:

- Frete para todo o Brasil.
- Embalagem especial para presente.
- Produtos artesanais e sustentáveis.
- Acesso ao Instagram.
- Acesso ao WhatsApp.

### B. Cabeçalho

Deverá conter:

- Logotipo Mespín.
- Início.
- Catálogo.
- Natal.
- Sobre.
- Contato.
- Campo de pesquisa.
- Ícone de carrinho com contador dinâmico.

O cabeçalho deverá ser responsivo e apresentar menu compacto em dispositivos móveis.

### C. Banner principal

Carrossel com 3 slides configuráveis em `settings.ts` (imagem, título, subtítulo, botão e destino), com setas, indicadores (pontos) e troca automática pausável, conforme o mockup. Slides: vela aconchegante, wax melts e linha de velas. O banner de Natal fica exclusivamente em `/natal`.

Utilizar fotografia de vela aromática em ambiente aconchegante, com iluminação quente e elementos naturais.

Texto:

**Aromas que transformam momentos**

"Velas e aromatizadores artesanais para uma casa mais acolhedora."

Botão:

**VER CATÁLOGO**

O botão deverá direcionar para a seção de produtos.

Animações:

- Fade-in dos textos.
- Entrada suave com movimento vertical.
- Zoom lento da imagem de fundo.
- Hover discreto no botão.

### D. Categorias

Apresentar categorias com ícones circulares:

1. Todas as categorias.
2. Velas.
3. Difusores.
4. Sprays.
5. Sachês.
6. Incensos.
7. Kits e Presentes.
8. Natal.

Cada categoria deverá ser clicável e direcionar para os produtos correspondentes.

### E. Catálogo em destaque

Apresentar uma seleção de produtos na página inicial.

Cada cartão deverá apresentar:

- Fotografia.
- Categoria.
- Nome.
- Descrição resumida.
- Preço.
- Selo promocional, quando aplicável.
- Botão ou ação para consultar detalhes.

O catálogo deverá ser alimentado pelos dados centralizados.

### F. Seção institucional

Criar uma seção apresentando a Mespín, destacando:

- Produção artesanal.
- Cuidado na escolha dos aromas.
- Produtos para presentear.
- Experiências de aconchego e bem-estar.

Utilizar textos institucionais configuráveis, sem inventar certificações ou alegações comerciais.

### G. Rodapé

Incluir:

- Logotipo.
- Slogan.
- Links de navegação.
- Instagram.
- WhatsApp.
- Informações comerciais.
- Aviso de direitos reservados.

# 6. PÁGINA EXCLUSIVA DE NATAL — `/natal`

<badge color="success">Página independente</badge>

A campanha de Natal deverá possuir uma página própria, independente da página inicial.

Não inserir o banner natalino dentro da página principal.

### A. Banner natalino

Utilizar a imagem natalina presente no projeto.

A composição deverá apresentar:

- Velas acesas.
- Pinhas.
- Ramos de pinheiro.
- Presentes.
- Luzes douradas.
- Laranja desidratada.
- Canela.
- Elementos naturais.

Título:

**Um Natal cheio de luz e aconchego**

Descrição:

"Presentes aromáticos feitos à mão para tornar os momentos especiais ainda mais inesquecíveis."

Botão:

**EXPLORAR COLEÇÃO DE NATAL**

O botão deverá direcionar para a grade de produtos natalinos.

### B. Catálogo natalino

Exibir somente os produtos identificados como natalinos.

Cada produto deverá manter as mesmas funcionalidades do catálogo principal:

- Visualização de detalhes.
- Seleção de aromas.
- Seleção de quantidades.
- Personalizações.
- Adição ao carrinho.

### C. Identidade visual

Utilizar a paleta oficial Mespín complementada por:

- Verde-pinho.
- Vinho.
- Dourado suave.

Manter a estética premium e artesanal.

### D. Navegação

O cliente deverá conseguir retornar facilmente à página principal e ao catálogo.

A página de Natal deverá compartilhar o mesmo carrinho da loja.

# 7. CATÁLOGO DE PRODUTOS

O catálogo deverá ser inteiramente configurável pelo arquivo `products.ts`.

Não utilizar produtos fictícios como conteúdo definitivo.

## 7.1. Estrutura dos produtos

Cada produto deverá possuir:

| Campo | Descrição |
|---|---|
| id | Identificador único |
| name | Nome comercial |
| category | Categoria |
| description | Descrição |
| image | Imagem principal |
| gallery | Imagens adicionais |
| price | Preço atual |
| originalPrice | Preço anterior, quando aplicável |
| aromas | Aromas disponíveis |
| available | Disponibilidade |
| featured | Produto em destaque |
| isChristmas | Produto natalino |
| badge | Etiqueta promocional |
| customization | Permite personalização |
| sortOrder | Ordem de exibição |

Exemplo:

```typescript
{
  id: "vela-aromatica-100g",
  name: "Vela Aromática 100g",
  category: "velas",
  description: "Vela em copo patê com 100g aromatizada.",
  image: "/assets/products/vela-100g.jpg",
  price: 32.00,
  available: true,
  featured: true,
  isChristmas: false,
  aromas: [
    "Lavanda",
    "Verbena Siciliana",
    "Flor de Laranjeira"
  ],
  customization: false
}
```

Os valores do exemplo são ilustrativos. Os dados definitivos devem ser obtidos dos arquivos e informações reais disponíveis no repositório.

## 7.2. Busca

O cliente deverá conseguir pesquisar produtos por:

- Nome.
- Categoria.
- Aroma.
- Termos presentes na descrição.

A busca deverá atualizar os resultados automaticamente.

Exibir mensagem amigável quando não houver resultados.

## 7.3. Filtros

Permitir filtrar por categoria.

Quando aplicável, oferecer filtros adicionais por:

- Produtos natalinos.
- Produtos em destaque.
- Faixa de preço.
- Disponibilidade.

Os filtros devem funcionar em conjunto.

## 7.4. Ordenação

Disponibilizar:

- Relevância.
- Menor preço.
- Maior preço.
- Ordem alfabética.

# 8. MODAL DE DETALHES DO PRODUTO

Ao clicar em um produto, abrir um modal elegante de compra.

O modal deverá ser compacto e aproveitar bem a área disponível da tela.

### Layout desktop

Duas colunas:

**Esquerda:**

- Imagem principal do produto.
- Imagem completa.
- Fundo creme.
- Centralização horizontal e vertical.
- `object-fit: contain`.

**Direita:**

- Categoria.
- Nome.
- Descrição.
- Preço.
- Seleção de aromas.
- Quantidades.
- Personalização, quando aplicável.
- Botão de adicionar ao carrinho.

### Regras visuais

- Imagem correspondente ao produto selecionado.
- Nunca exibir banner promocional no lugar da imagem do produto.
- Não cortar ou distorcer a fotografia.
- Não exibir `undefined` ou `null`.
- Botão de fechar no canto superior direito.
- Altura máxima baseada na janela.
- Layout sem rolagem no cenário desktop habitual.

### Seleção de aromas

O cliente deverá conseguir escolher diferentes aromas e quantidades, quando o produto permitir.

Exemplo:

| Aroma | Quantidade |
|---|---:|
| Lavanda | 2 |
| Verbena Siciliana | 1 |
| Flor de Laranjeira | 0 |

Cada aroma terá controles de menos e mais.

A quantidade zero significa que o aroma não foi selecionado.

Não permitir adicionar ao carrinho uma configuração sem quantidade válida.

Se houver muitos aromas, utilizar uma área compacta de seleção, preservando a visibilidade do botão de compra.

Em dispositivos móveis, adaptar o modal sem ocultar informações ou controles.

# 9. CARRINHO DE COMPRAS

O carrinho será compartilhado entre todas as páginas.

Utilizar React Context ou solução equivalente para manter o estado global.

## 9.1. Acesso ao carrinho

O carrinho deverá estar disponível pelo ícone no cabeçalho.

Ao clicar, abrir um drawer lateral ou página de carrinho.

Exibir contador dinâmico no ícone.

## 9.2. Informações de cada item

Cada item deverá conter:

- Imagem.
- Nome.
- Aroma.
- Personalização.
- Quantidade.
- Preço unitário.
- Subtotal.
- Botão de remover.

## 9.3. Agrupamento dos aromas

Quando o cliente adicionar um produto com diferentes aromas, preservar cada combinação de aroma e quantidade.

Não perder as informações ao adicionar mais produtos.

## 9.4. Operações

Permitir:

- Aumentar quantidade.
- Diminuir quantidade.
- Remover item.
- Limpar carrinho.
- Voltar ao catálogo.
- Finalizar pedido.

O subtotal deverá ser recalculado automaticamente.

## 9.5. Persistência

Salvar o carrinho no LocalStorage.

Ao atualizar a página ou navegar entre as páginas, os itens deverão permanecer.

O carrinho deverá ser recuperado quando o cliente retornar ao site no mesmo navegador.

Não utilizar armazenamento de dados pessoais sensíveis.

# 10. FINALIZAÇÃO DO PEDIDO PELO WHATSAPP

<badge color="success">Funcionalidade central</badge>

Não haverá checkout com pagamento online.

O processo de finalização deverá direcionar o cliente para o WhatsApp comercial da Mespín, com uma mensagem contendo o pedido completo.

## 10.1. Etapa de identificação

Antes de finalizar, solicitar:

- Nome completo.
- CEP de entrega.

Campos obrigatórios.

O endereço completo poderá ser combinado posteriormente pelo WhatsApp.

Não solicitar informações de pagamento ou documentos pessoais.

## 10.2. Resumo do pedido

Antes de redirecionar, apresentar:

- Produtos.
- Aromas escolhidos.
- Quantidades por aroma.
- Personalizações.
- Preços unitários.
- Subtotais.
- Total do pedido.

O cliente deverá conseguir voltar ao carrinho para realizar alterações.

## 10.3. Mensagem automática

Ao confirmar, gerar uma mensagem estruturada.

Exemplo:

Olá! Gostaria de realizar um pedido na Mespín! 🕯️

*DADOS DO CLIENTE*

Nome: Maria Silva
CEP: 30100-000

*MEU PEDIDO*

1. Vela Aromática 100g
- Lavanda: 2 unidades
- Verbena Siciliana: 1 unidade

Valor: R$ 96,00

2. Kit Vela Dupla
- Aroma: Flor de Laranjeira
- Quantidade: 1

Valor: R$ 70,00

*RESUMO*

Subtotal: R$ 166,00
Frete: A combinar

*TOTAL DOS PRODUTOS: R$ 166,00*

Aguardo as informações para finalizar a compra. Obrigada!

A mensagem deverá ser construída dinamicamente, conforme os dados reais do carrinho.

Não utilizar valores fixos no código.

## 10.4. Redirecionamento

Utilizar:

`https://wa.me/NUMERO?text=MENSAGEM_CODIFICADA`

Requisitos:

- Número configurável.
- Utilizar formato internacional com código do país e DDD.
- Codificar a mensagem corretamente com `encodeURIComponent`.
- Abrir o WhatsApp em nova aba ou aplicativo.
- Funcionar em celulares e computadores.
- Validar o número configurado antes de gerar o link.

Não limpar o carrinho antes de confirmar que o cliente conseguiu abrir o WhatsApp.

Como não existe backend, o sistema não poderá confirmar se o pedido foi efetivamente enviado. Portanto, deverá manter os itens no carrinho até o cliente concluir o processo ou limpar manualmente.

# 11. PERSONALIZAÇÃO DOS PRODUTOS

O sistema deverá suportar produtos com personalizações.

Quando aplicável, permitir:

- Escolha de aroma.
- Escolha de quantidade.
- Texto personalizado.
- Nome para rótulo.
- Mensagem para presente.
- Observações adicionais.

As opções devem ser configuráveis por produto.

Não exibir campos de personalização para produtos que não os permitem.

As informações escolhidas deverão aparecer no carrinho e na mensagem do WhatsApp.

# 12. EXPERIÊNCIA RESPONSIVA

O sistema deverá funcionar perfeitamente em:

- Desktop.
- Notebook.
- Tablet.
- Smartphones Android.
- iPhones.

Referências de validação:

| Dispositivo | Largura |
|---|---:|
| Desktop | 1440px |
| Notebook | 1024px |
| Tablet | 768px |
| Celular | 390px |
| Celular compacto | 360px |

### Desktop

- Navegação horizontal.
- Catálogo com múltiplas colunas.
- Modal em duas colunas.
- Banner amplo.
- Carrinho lateral.

### Tablet

- Adaptação da grade.
- Navegação compacta quando necessário.
- Modal ajustado à largura disponível.

### Celular

- Menu hambúrguer.
- Busca acessível.
- Carrinho visível.
- Categorias com rolagem horizontal.
- Catálogo em duas colunas quando houver espaço suficiente.
- Modal adaptado para uma coluna.
- Botões grandes e fáceis de tocar.
- Carrinho adaptado para tela cheia ou drawer.

Não permitir rolagem horizontal involuntária.

Garantir legibilidade, espaçamento e acessibilidade.

# 13. ANIMAÇÕES E MICROINTERAÇÕES

Utilizar animações discretas:

- Fade-in ao carregar seções.
- Entrada suave dos banners.
- Zoom lento nas imagens principais.
- Hover nos cartões de produtos.
- Transições nos botões.
- Animação ao adicionar produtos ao carrinho.
- Feedback visual ao alterar quantidades.
- Transição suave ao abrir e fechar modais e drawers.

Evitar efeitos excessivos.

Respeitar `prefers-reduced-motion`.

# 14. CONFIGURAÇÃO DE PRODUTOS SEM BACKEND

Todos os produtos deverão ser cadastrados em arquivos TypeScript ou JSON dentro do projeto.

O objetivo é permitir que a proprietária atualize:

- Nome.
- Categoria.
- Descrição.
- Preço.
- Imagens.
- Aromas.
- Disponibilidade.
- Destaques.
- Coleção natalina.
- Personalizações.

Sem precisar alterar componentes React.

Criar documentação simples explicando como cadastrar um produto, atualizar preços e adicionar imagens.

**Importante:** não criar painel administrativo falso. As alterações serão realizadas diretamente nos arquivos de configuração do projeto e publicadas novamente.

Como não haverá backend, os preços e a disponibilidade não serão sincronizados em tempo real. A versão publicada representará os dados da última publicação.

# 15. SEGURANÇA E LIMITAÇÕES

O site será público e estático.

Portanto:

- Não incluir senhas ou tokens secretos no frontend.
- Não armazenar dados de cartão.
- Não simular pagamentos.
- Não apresentar autenticação fictícia.
- Não implementar estoque em tempo real.
- Não utilizar chaves privadas em arquivos públicos.
- Validar os dados do formulário antes de gerar o WhatsApp.
- Não enviar dados do cliente para serviços externos desnecessários.

O cliente deverá entender que a finalização é uma solicitação de pedido pelo WhatsApp e que preço de frete, disponibilidade final e pagamento serão confirmados no atendimento.

# 16. PUBLICAÇÃO NO GITHUB PAGES

Preparar o projeto para publicação no GitHub Pages.

Utilizar Vite com configuração de `base` compatível com o nome do repositório.

Preferir `HashRouter` para facilitar o funcionamento das rotas em hospedagem estática sem configuração adicional de servidor.

Rotas esperadas:

- `#/` — Página inicial.
- `#/catalogo` — Catálogo.
- `#/natal` — Página exclusiva de Natal.

Configurar GitHub Actions para publicação automática.

Verificar:

- Caminhos relativos dos recursos.
- Carregamento das imagens.
- Fontes.
- Rotas.
- CSS.
- JavaScript.
- Funcionamento do WhatsApp.
- Persistência do carrinho.

O site deverá funcionar tanto no ambiente local quanto na URL publicada.

# 17. CRITÉRIOS DE ACEITAÇÃO

O projeto somente será considerado concluído quando os seguintes requisitos forem atendidos:

- [ ] Site implementado em React e TypeScript.
- [ ] Identidade visual fiel à referência Mespín.
- [ ] Logotipo original utilizado.
- [ ] Página inicial completa.
- [ ] Página de Natal independente.
- [ ] Catálogo alimentado por dados configuráveis.
- [ ] Busca funcional.
- [ ] Filtros funcionais.
- [ ] Produtos com imagens corretas.
- [ ] Modal de detalhes funcional.
- [ ] Imagem completa no modal.
- [ ] Seleção de múltiplos aromas.
- [ ] Seleção independente de quantidades.
- [ ] Personalização dos produtos quando aplicável.
- [ ] Carrinho compartilhado entre páginas.
- [ ] Persistência do carrinho no LocalStorage.
- [ ] Cálculo correto dos subtotais e totais.
- [ ] Formulário de identificação do cliente.
- [ ] Coleta do CEP.
- [ ] Resumo do pedido.
- [ ] Geração da mensagem automática.
- [ ] Redirecionamento correto para WhatsApp.
- [ ] Responsividade em diferentes dispositivos.
- [ ] Acessibilidade básica.
- [ ] Nenhuma dependência de backend.
- [ ] Compatibilidade com GitHub Pages.
- [ ] Documentação para manutenção do catálogo.

# 18. ORDEM DE DESENVOLVIMENTO

Executar o projeto na seguinte sequência:

**Fase 1 — Estrutura**
- Analisar os arquivos existentes.
- Configurar React, TypeScript e Vite.
- Criar estrutura modular.
- Configurar rotas e identidade visual.

**Fase 2 — Interface**
- Desenvolver cabeçalho.
- Criar página inicial.
- Implementar banners.
- Criar navegação por categorias.
- Desenvolver catálogo.
- Criar página de Natal.

**Fase 3 — Produtos**
- Implementar dados centralizados.
- Criar cartões.
- Implementar modal.
- Implementar seleção de aromas.
- Implementar personalizações.

**Fase 4 — Carrinho**
- Criar contexto global.
- Implementar operações do carrinho.
- Integrar LocalStorage.
- Calcular subtotais e totais.

**Fase 5 — Finalização**
- Criar formulário do cliente.
- Criar resumo do pedido.
- Implementar integração WhatsApp.
- Validar mensagens e valores.

**Fase 6 — Qualidade**
- Testar todas as funcionalidades.
- Validar responsividade.
- Corrigir erros.
- Verificar acessibilidade.

**Fase 7 — Publicação**
- Configurar Vite para GitHub Pages.
- Criar workflow de deploy.
- Documentar publicação e manutenção.

# 19. ORIENTAÇÕES FINAIS AO AGENTE

Antes de começar a programar:

1. Analise todos os arquivos presentes no repositório.
2. Localize e examine a imagem `Mespín_ Aromas que Transformam Momentos.png`.
3. Identifique os recursos gráficos disponíveis, especialmente logotipo, banners e fotografias de produtos.
4. Reutilize as imagens reais disponíveis.
5. Não invente informações comerciais.
6. Não descaracterize a identidade visual da Mespín.

Implemente o sistema completo, não apenas uma demonstração visual.

Não deixe botões sem funcionamento, páginas incompletas ou dados fictícios apresentados como reais.

Não finalize o trabalho apenas quando a interface estiver pronta: todas as operações de navegação, seleção, carrinho e finalização pelo WhatsApp precisam funcionar.

Ao concluir, apresente:

- Estrutura final do projeto.
- Funcionalidades implementadas.
- Arquivos de configuração dos produtos.
- Como configurar o WhatsApp.
- Como cadastrar novos produtos.
- Como atualizar imagens e preços.
- Como executar localmente.
- Como publicar no GitHub Pages.
- Testes realizados e limitações identificadas.

# 20. DECISÕES DE PROJETO (ESCLARECIMENTOS)

Estas decisões complementam e, em caso de conflito, prevalecem sobre as seções anteriores.

1. **Assets:** originais na pasta `Assets/` (logo `Logo_Mespín.png`, banners, `produto-001` a `005` e o mockup). Versões otimizadas são geradas em `public/assets/`.
2. **Produtos iniciais:** os 12 produtos do mockup. Produtos sem foto real usam placeholder de marca. Produtos cujo preço não aparece no mockup ficam com preço "Sob consulta" (botão leva ao WhatsApp) até a lista oficial ser enviada. Aromas pendentes não são inventados; os aromas reais vêm das fotos (Lavanda, Verbena Siciliana, Bambu, Cereja & Macadâmia, Flor de Laranjeira).
3. **Navegação:** Início, Catálogo (`/catalogo`, página própria com busca, filtros e ordenação), Natal (`/natal`), Sobre e Contato (seções âncora da home). Não haverá ícone "Entrar" (sem autenticação).
4. **Rotas (HashRouter):** `#/`, `#/catalogo`, `#/natal`. Onde o plano cita `/natal`, entenda-se `#/natal` na URL publicada.
5. **Card de produto:** "Adicionar" abre o modal quando o produto tem aromas ou personalização; adiciona direto se for item simples. Produto indisponível mostra "Esgotado", sem botão.
6. **Carrinho:** itens com mesmo produto, mesmo aroma e mesma personalização são somados em uma única linha. Limite de 99 unidades por linha.
7. **Personalização por produto:** `customization: { fields: ["labelName" | "giftMessage" | "notes"] }` (ausente = sem personalização).
8. **Mensagem WhatsApp:** cada linha de aroma no formato `- Aroma: N unidade(s)`; produtos sem aroma listam `- Quantidade: N`. Frete sempre "A combinar".
9. **Frete:** barra superior mantém "Frete para todo o Brasil"; o pedido informa "A combinar".
10. **WhatsApp:** `5531984840078`. Repositório: `https://github.com/LauraMSpin/LojaMespin2.0.git` (`base` do Vite: `/LojaMespin2.0/`).
11. **CEP:** validação apenas de formato (8 dígitos), sem API externa.
12. **Fontes:** Cormorant Garamond e Lato hospedadas no projeto (pacotes `@fontsource`).
13. **Ícones:** Lucide React, inclusive nas categorias circulares.
14. **Qualidade:** testes com Vitest (carrinho, mensagem e link do WhatsApp, validações) e meta tags/Open Graph básicas.

**RESULTADO FINAL ESPERADO**

Uma loja virtual Mespín completa, elegante, responsiva e funcional, construída em React, sem backend, com catálogo configurável, carrinho persistente e finalização de pedidos pelo WhatsApp, pronta para publicação no GitHub Pages.