# ESPECIFICAÇÃO FUNCIONAL — RODAPÉ DO E-COMMERCE MESPÍN

**Projeto:** Mespín — Chamas com Alma  
**Componente:** Footer (Rodapé institucional)  
**Tecnologia:** React + TypeScript + CSS  
**Hospedagem:** GitHub Pages  
**Versão:** 1.0

---

# 1. OBJETIVO

Desenvolver um novo rodapé institucional para o e-commerce da Mespín, substituindo o rodapé atual por uma composição visual mais sofisticada, elegante e organizada.

O novo rodapé deverá seguir fielmente o mockup de referência disponibilizado, mantendo a identidade visual da marca.

O componente deverá funcionar em todas as páginas do site e apresentar:

- Identidade visual da Mespín.
- Logotipo e slogan.
- Descrição institucional.
- Links de navegação.
- Informações de atendimento.
- Acesso ao WhatsApp.
- Acesso ao Instagram.
- Informações sobre o processo de pedidos.
- Direitos autorais.
- Elementos decorativos.
- Botão de contato destacado.

O rodapé deverá ser um componente React reutilizável, compartilhado entre as páginas da aplicação.

# 2. REFERÊNCIA VISUAL

Utilizar o mockup visual fornecido como referência obrigatória para a implementação.

A composição deverá reproduzir:

- Fundo marrom profundo.
- Três colunas principais.
- Logotipo em destaque à esquerda.
- Navegação centralizada na coluna intermediária.
- Atendimento na coluna direita.
- Divisórias verticais em caramelo.
- Elementos botânicos discretos nas extremidades.
- Linha horizontal separando o conteúdo principal do rodapé inferior.
- Copyright à esquerda.
- Mensagem artesanal e botão de WhatsApp à direita.

Não utilizar um modelo genérico de footer.

A implementação deverá preservar as proporções, a hierarquia visual, o espaçamento e a distribuição dos elementos apresentados no mockup.

# 3. IDENTIDADE VISUAL

Utilizar a paleta oficial da Mespín:

| Elemento | Cor |
|---|---|
| Fundo principal | `#3E2723` |
| Fundo secundário | `#3E2723` ou variação mais escura |
| Títulos | `#C19A6B` |
| Textos | `#FAF0E6` |
| Divisórias | `#A0522D` |
| Detalhes botânicos | `#6B8E23` |
| Botão WhatsApp | Verde-oliva |
| Texto do botão | `#FAF0E6` |

O fundo poderá utilizar um gradiente extremamente sutil entre tons de marrom, desde que não descaracterize a identidade original.

### Tipografia

- Títulos das colunas: fonte serifada elegante.
- Slogan: fonte serifada com estilo itálico.
- Textos e links: fonte sans-serif.
- Copyright: fonte sans-serif menor.

Utilizar as fontes já adotadas no restante do projeto, mantendo consistência visual.

# 4. ESTRUTURA DO RODAPÉ

O rodapé deverá possuir duas áreas principais:

1. Área institucional, com três colunas.
2. Área inferior, com informações legais e elementos complementares.

## 4.1. Primeira coluna — Identidade da marca

Localização: lado esquerdo.

Conteúdo:

**A. Logotipo**

- Exibir o logotipo original da Mespín.
- Utilizar uma versão com fundo claro, caso essa seja a versão disponível no projeto.
- Preservar a proporção original.
- Não esticar, distorcer ou redesenhar.
- Centralizar dentro da coluna.
- Utilizar dimensões visualmente semelhantes às do mockup.

**B. Slogan**

Exibir:

"Chamas com Alma"

Características:
- Fonte serifada.
- Estilo itálico.
- Cor caramelo.
- Destaque visual em relação aos textos institucionais.

**C. Descrição institucional**

Exibir:

"Aromas artesanais para transformar seus momentos."

A descrição deverá ficar abaixo do slogan, com largura limitada para permitir uma quebra de linha natural.

O texto deverá ser configurável futuramente.

## 4.2. Segunda coluna — Navegação

Localização: coluna central.

Título:

"Explore"

O título deverá utilizar fonte serifada e cor caramelo.

Links obrigatórios:

- Início.
- Catálogo.
- Natal.
- Sobre.
- Contato.

### Comportamento dos links

**Início**
- Direcionar para a página inicial.

**Catálogo**
- Direcionar para a página de catálogo.
- Se o catálogo estiver integrado à página inicial, direcionar para a seção correspondente.

**Natal**
- Direcionar para a página independente da coleção de Natal.

**Sobre**
- Direcionar para a seção institucional da marca.
- Caso ainda não exista uma página independente, utilizar a seção institucional já disponível.

**Contato**
- Direcionar para a seção de contato ou abrir o WhatsApp comercial.

Todos os links deverão funcionar corretamente no ambiente publicado no GitHub Pages.

Não utilizar destinos fictícios ou links vazios.

### Efeitos de interação

Ao passar o mouse:
- Alterar suavemente a cor do link.
- Utilizar caramelo como cor de destaque.
- Aplicar uma transição curta.
- Evitar sublinhados ou animações excessivas.

Em dispositivos móveis, os links deverão permanecer organizados verticalmente e com áreas de toque adequadas.

## 4.3. Terceira coluna — Atendimento

Localização: lado direito.

Título:

"Fale com a Mespín"

Utilizar fonte serifada elegante, tamanho destacado e cor caramelo.

### A. WhatsApp

Exibir:

Ícone do WhatsApp + WhatsApp (31) 98484-0078

Comportamento:
- O item deverá ser clicável.
- Abrir uma conversa com o número comercial da Mespín.
- Utilizar o link `https://wa.me/5531984840078`.
- Abrir em nova aba ou no aplicativo do WhatsApp, conforme o dispositivo.
- Poderá utilizar uma mensagem inicial configurável.

Mensagem sugerida:

"Olá! Conheci a Mespín pelo site e gostaria de mais informações sobre os produtos."

### B. Instagram

Exibir:

Ícone do Instagram + @velasmespin

Link:

`https://www.instagram.com/velasmespin/`

Comportamento:
- Abrir o perfil oficial da marca.
- Abrir em nova aba.
- Utilizar `target="_blank"` e `rel="noopener noreferrer"`.

### C. Informações sobre atendimento

Exibir o texto:

"Pedidos finalizados pelo WhatsApp. Frete, disponibilidade e pagamento são confirmados no atendimento."

O texto deverá:
- Ter fonte menor que o restante dos elementos.
- Utilizar cor creme.
- Ter largura limitada.
- Apresentar espaçamento confortável.
- Quebrar linhas naturalmente.

Não adicionar horários de funcionamento, prazos de entrega ou outras informações que não tenham sido oficialmente definidas.

# 5. DIVISÓRIAS E ORGANIZAÇÃO VISUAL

As três colunas deverão ser separadas por linhas verticais finas em caramelo ou terracota.

Características:

- Espessura aproximada de 1px.
- Altura proporcional ao conteúdo das colunas.
- Opacidade moderada.
- Espaçamento adequado entre as colunas.

As divisórias deverão desaparecer ou ser substituídas por separadores horizontais em telas menores.

Manter as três colunas visualmente equilibradas.

Não permitir que a coluna de atendimento fique excessivamente larga ou que a navegação fique comprimida.

# 6. ELEMENTOS BOTÂNICOS DECORATIVOS

Adicionar elementos decorativos inspirados em folhas, ramos e plantas.

Características:

- Ilustrações lineares.
- Traços delicados.
- Cor caramelo ou terracota.
- Opacidade reduzida.
- Posicionamento nas extremidades do rodapé.
- Não interferir na leitura dos textos.
- Não bloquear links ou botões.

Os elementos deverão ser utilizados preferencialmente como SVGs decorativos ou imagens já disponíveis no projeto.

Caso seja necessário criar ilustrações, utilizar SVG simples e leve.

Não utilizar emojis como substitutos das ilustrações botânicas.

Os elementos decorativos deverão possuir `pointer-events: none` e ser ocultados ou simplificados em telas pequenas quando necessário.

# 7. RODAPÉ INFERIOR

Abaixo das três colunas, criar uma linha horizontal em caramelo, ocupando praticamente toda a largura disponível.

A linha deverá separar visualmente o conteúdo institucional das informações finais.

## 7.1. Copyright

Alinhado à esquerda.

Exibir:

"© [ANO ATUAL] Mespín — Chamas com Alma. Todos os direitos reservados."

O ano deverá ser obtido dinamicamente pelo JavaScript, utilizando `new Date().getFullYear()`.

Não deixar o ano fixo no código.

## 7.2. Mensagem artesanal

Na região direita, exibir:

Ícone botânico + "Feito com carinho"

Características:
- Fonte serifada.
- Estilo itálico.
- Cor creme ou caramelo.
- Pequeno ícone de folha em verde-oliva.

## 7.3. Botão de WhatsApp

Adicionar um botão de destaque na extremidade direita.

Texto:

"Fale no WhatsApp"

Elementos:
- Ícone oficial ou equivalente do WhatsApp.
- Texto legível.
- Fundo verde-oliva.
- Texto creme.
- Cantos arredondados.
- Padding confortável.
- Altura consistente com o mockup.

Comportamento:
- Abrir conversa com o WhatsApp comercial da Mespín.
- Utilizar o mesmo número configurado no restante do sistema.
- Abrir em nova aba ou aplicativo.
- Utilizar mensagem inicial configurável.

Mensagem sugerida:

"Olá! Gostaria de conhecer melhor os produtos da Mespín."

### Interações visuais

Ao passar o mouse:
- Aplicar pequena elevação.
- Alterar levemente a tonalidade do fundo.
- Utilizar transição de aproximadamente 200ms.
- Não aplicar animações exageradas.

Em dispositivos móveis, o botão deverá ocupar uma largura adequada, sem ultrapassar a tela.

# 8. RESPONSIVIDADE

O rodapé deverá funcionar em diferentes resoluções.

## Desktop — 1440px ou superior

- Três colunas horizontais.
- Divisórias verticais.
- Logotipo em destaque.
- Conteúdo distribuído de forma equilibrada.
- Área inferior em uma única linha.

## Notebook — 1024px

- Manter três colunas, ajustando os espaçamentos.
- Reduzir proporcionalmente o tamanho do logotipo e dos títulos.
- Evitar que os textos fiquem comprimidos.

## Tablet — 768px

- Adaptar a distribuição para duas colunas ou três blocos com largura reduzida, conforme o espaço.
- Reorganizar o atendimento quando necessário.
- Utilizar divisórias horizontais.
- Manter todos os links acessíveis.

## Celular — 390px e 360px

Organizar o rodapé verticalmente:

1. Logotipo.
2. Slogan.
3. Descrição institucional.
4. Navegação.
5. Atendimento.
6. Instagram.
7. Informações sobre pedidos.
8. Mensagem artesanal.
9. Botão de WhatsApp.
10. Copyright.

Características:
- Conteúdo centralizado.
- Espaçamento confortável.
- Links com áreas de toque adequadas.
- Botão de WhatsApp com largura adequada.
- Elementos botânicos reduzidos ou ocultos.
- Sem rolagem horizontal.
- Sem textos cortados.

Não simplesmente reduzir todo o rodapé desktop. Reorganizar os blocos para uma experiência adequada ao celular.

# 9. FUNCIONALIDADES E CONFIGURAÇÕES

O rodapé deverá utilizar configurações centralizadas, sem repetir informações comerciais em vários componentes.

Criar ou reutilizar um arquivo de configuração da loja contendo:

- Nome da marca.
- Slogan.
- Logotipo.
- Número do WhatsApp.
- Link do Instagram.
- Mensagem inicial do WhatsApp.
- Descrição institucional.
- Informações sobre pedidos.

O número de WhatsApp e os links deverão ser reutilizados também nos demais componentes do sistema.

Se o projeto já possuir um arquivo `settings.ts`, utilizar essa configuração existente.

Não duplicar o número do WhatsApp em diferentes arquivos.

# 10. ACESSIBILIDADE

Implementar:

- HTML semântico com elemento `<footer>`.
- Links com nomes acessíveis.
- Textos alternativos para o logotipo.
- Ícones decorativos com `aria-hidden="true"`.
- Foco visível ao navegar pelo teclado.
- Contraste adequado entre textos e fundo.
- Botões com áreas de toque adequadas.
- Navegação compatível com leitores de tela.

Não utilizar somente cores para comunicar estados ou interações.

# 11. DESEMPENHO

- Preferir SVGs para ícones e elementos botânicos.
- Otimizar imagens.
- Evitar bibliotecas desnecessárias.
- Não carregar imagens pesadas apenas para decoração.
- Evitar animações contínuas que consumam recursos.
- Utilizar CSS para transições simples.
- Não prejudicar o tempo de carregamento do site.

# 12. IMPLEMENTAÇÃO EM REACT

Criar um componente reutilizável, por exemplo:

`src/components/Footer/Footer.tsx`

Organizar os estilos em arquivo próprio.

O componente deverá ser incluído no layout global da aplicação, para aparecer automaticamente em todas as páginas que utilizem o layout principal.

Não criar cópias diferentes do rodapé para a página inicial, catálogo e Natal.

Caso alguma página possua necessidade específica, permitir configuração por propriedades, sem duplicar a implementação.

Garantir que o footer permaneça no final do conteúdo e não fique flutuando no meio da tela quando uma página possuir pouco conteúdo.

# 13. CRITÉRIOS DE ACEITAÇÃO

O desenvolvimento será considerado concluído quando:

- [ ] O rodapé reproduzir fielmente o mockup.
- [ ] O logotipo original estiver correto.
- [ ] O slogan estiver presente.
- [ ] A descrição institucional estiver presente.
- [ ] Os cinco links de navegação estiverem funcionando.
- [ ] O link do WhatsApp abrir a conversa correta.
- [ ] O link do Instagram abrir o perfil correto.
- [ ] As informações sobre pedidos estiverem visíveis.
- [ ] As três colunas estiverem equilibradas.
- [ ] As divisórias estiverem posicionadas corretamente.
- [ ] Os elementos botânicos estiverem implementados.
- [ ] A linha horizontal estiver presente.
- [ ] O ano do copyright for dinâmico.
- [ ] A mensagem "Feito com carinho" estiver presente.
- [ ] O botão de WhatsApp estiver funcional.
- [ ] O rodapé for responsivo.
- [ ] Não houver rolagem horizontal.
- [ ] Não houver textos cortados.
- [ ] O componente for reutilizado em todas as páginas.
- [ ] O número de WhatsApp estiver centralizado na configuração.
- [ ] O rodapé funcionar corretamente no GitHub Pages.

# 14. TESTES OBRIGATÓRIOS

Após a implementação:

1. Abrir a página inicial e verificar o rodapé.
2. Abrir a página de catálogo e verificar o rodapé.
3. Abrir a página de Natal e verificar o rodapé.
4. Testar todos os links de navegação.
5. Testar o WhatsApp.
6. Testar o Instagram.
7. Verificar o ano dinâmico.
8. Testar o foco por teclado.
9. Verificar a responsividade em 1440px, 1024px, 768px, 390px e 360px.
10. Conferir se os elementos não se sobrepõem.
11. Verificar se não existem erros no console.

# 15. ORIENTAÇÕES FINAIS AO AGENTE

Antes de iniciar:

- Analise o rodapé atual.
- Analise a estrutura React existente.
- Localize o logotipo original.
- Consulte a identidade visual já implementada.
- Consulte o mockup de referência.

Implemente diretamente no projeto existente.

Não altere o cabeçalho, os banners, o catálogo ou o carrinho como parte desta tarefa.

Não remova informações comerciais existentes sem necessidade.

Não invente links, telefones ou informações institucionais.

O resultado deverá ser visualmente muito próximo do mockup, mas com todos os elementos funcionais.

Ao finalizar, informe os arquivos modificados, os testes realizados e eventuais pendências.

**RESULTADO ESPERADO:** um rodapé institucional premium, elegante, responsivo e funcional, que fortaleça a identidade da Mespín e ofereça acesso rápido à navegação e aos canais de atendimento da marca.