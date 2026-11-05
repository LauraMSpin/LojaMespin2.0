# COMPLEMENTO DA ESPECIFICAÇÃO — KITS COM MÚLTIPLOS ITENS E PERSONALIZAÇÃO INDIVIDUAL

**Projeto:** Mespín — Chamas com Alma  
**Módulo:** Produtos compostos / Kits  
**Tecnologia:** React + TypeScript  
**Integração:** Carrinho global e WhatsApp

## 1. OBJETIVO

Implementar uma funcionalidade específica para produtos vendidos em formato de kits, nos quais cada kit é composto por dois ou mais itens individuais.

Exemplos:
- Kit Vela Dupla.
- Kit com três velas.
- Kit presente com vela e difusor.
- Kits personalizados com diferentes produtos.

O cliente deverá conseguir selecionar os aromas e demais características de cada item individualmente, respeitando a composição cadastrada para o kit.

**Regra fundamental:** a quantidade de escolhas de aromas deverá respeitar exatamente a quantidade de itens que compõem cada kit, considerando os itens que permitem escolha de aroma.

Não permitir que o cliente selecione aromas a mais ou a menos.

## 2. CONFIGURAÇÃO DA COMPOSIÇÃO DOS KITS

Cada produto do tipo kit deverá possuir uma composição configurável.

Criar uma estrutura que permita definir:

- Nome do kit.
- Quantidade de itens que o compõem.
- Tipo de cada item.
- Nome de cada item.
- Quantidade de cada componente.
- Se o componente permite escolha de aroma.
- Aromas disponíveis para cada componente.
- Outras opções de personalização aplicáveis.

Exemplo de configuração:

**Kit Vela Dupla**

Composição:
- 2 unidades de vela aromática.
- Cada vela permite escolher um aroma individualmente.

**Kit Presente Especial**

Composição:
- 1 vela aromática.
- 1 difusor.
- 1 sachê aromático.

Cada componente poderá possuir opções próprias de personalização.

A composição deverá ser definida no arquivo de dados do produto, sem necessidade de modificar os componentes React.

## 3. SELEÇÃO DOS ITENS DO KIT

Ao abrir o modal de um kit, apresentar uma seção chamada:

**Personalize seu kit**

O cliente deverá visualizar cada item individualmente.

Exemplo para o Kit Vela Dupla:

**Escolha os aromas das suas velas**

<escape>Vela 1</escape>
[Selecione o aroma]

<escape>Vela 2</escape>
[Selecione o aroma]

O cliente deverá selecionar um aroma para cada vela.

Não apresentar apenas uma lista genérica de aromas com quantidades, pois isso não permite identificar qual aroma pertence a cada item do kit.

### Regras de seleção

1. Cada item deverá possuir sua própria seleção.
2. A seleção deverá ser independente.
3. Um mesmo aroma poderá ser escolhido mais de uma vez, se estiver disponível.
4. Cada item deverá possuir um identificador próprio.
5. Não permitir adicionar o kit ao carrinho enquanto existirem escolhas obrigatórias pendentes.
6. A quantidade de seleções deverá corresponder à composição cadastrada.
7. Caso um componente não permita personalização, exibir apenas sua identificação e descrição.

## 4. COMPRA DE MAIS DE UM KIT

Esta é uma regra especialmente importante.

Quando o cliente selecionar mais de uma unidade do mesmo kit, o sistema deverá criar grupos independentes para cada unidade.

Exemplo: cliente adiciona 3 unidades do Kit Vela Dupla.

A interface deverá apresentar:

**Kit 1**

- Vela 1: Lavanda.
- Vela 2: Flor de Laranjeira.

**Kit 2**

- Vela 1: Bambu.
- Vela 2: Verbena Siciliana.

**Kit 3**

- Vela 1: Lavanda.
- Vela 2: Cereja e Macadâmia.

O cliente deverá conseguir personalizar cada kit separadamente.

Não permitir que a seleção do Kit 1 seja automaticamente replicada para os demais kits, a menos que o cliente escolha explicitamente uma opção de repetição.

### Recurso opcional de praticidade

Adicionar uma opção:

"Repetir a configuração do kit anterior."

Quando selecionada, copiar as escolhas do kit anterior para o próximo, permitindo que o cliente ainda faça alterações individuais.

Esse recurso deverá facilitar compras em grandes quantidades.

## 5. CONTROLES DA INTERFACE

A apresentação deverá ser visualmente organizada e seguir o padrão premium da Mespín.

Cada kit deverá ser exibido em um bloco separado, com identificação clara.

Exemplo:

**Kit Vela Dupla — Unidade 1**

| Item | Aroma |
|---|---|
| Vela 1 | Lavanda |
| Vela 2 | Flor de Laranjeira |

**Kit Vela Dupla — Unidade 2**

| Item | Aroma |
|---|---|
| Vela 1 | Bambu |
| Vela 2 | Verbena Siciliana |

Utilizar seletores ou cartões para os aromas, mantendo a experiência intuitiva.

No celular, organizar os itens verticalmente.

## 6. ESTRUTURA DOS DADOS

A composição deverá ser configurável.

Exemplo ilustrativo:

```typescript
{
  id: "kit-vela-dupla",
  name: "Kit Vela Dupla",
  type: "kit",
  price: 70.00,

  composition: [
    {
      componentId: "vela-1",
      name: "Vela 1",
      productType: "vela",
      quantity: 1,
      allowsAromaSelection: true,
      availableAromas: [
        "Lavanda",
        "Bambu",
        "Flor de Laranjeira",
        "Verbena Siciliana"
      ]
    },
    {
      componentId: "vela-2",
      name: "Vela 2",
      productType: "vela",
      quantity: 1,
      allowsAromaSelection: true,
      availableAromas: [
        "Lavanda",
        "Bambu",
        "Flor de Laranjeira",
        "Verbena Siciliana"
      ]
    }
  ]
}
```

Essa estrutura é ilustrativa. O agente deverá implementá-la de forma flexível, permitindo kits com diferentes tipos e quantidades de componentes.

## 7. CARRINHO DE COMPRAS

O carrinho deverá preservar integralmente a composição de cada kit.

Não armazenar apenas o nome do kit, preço e quantidade.

Cada unidade deverá possuir sua própria identificação e suas personalizações.

Exemplo de representação:

**Kit Vela Dupla — 3 unidades**

- Kit 1: Lavanda + Flor de Laranjeira.
- Kit 2: Bambu + Verbena Siciliana.
- Kit 3: Lavanda + Cereja e Macadâmia.

O carrinho deverá permitir:

- Visualizar os itens de cada kit.
- Identificar claramente cada unidade.
- Editar a personalização de uma unidade específica.
- Remover uma unidade específica.
- Remover o kit inteiro.
- Adicionar novos kits com configurações diferentes.

Se o cliente adicionar outro Kit Vela Dupla com aromas diferentes, não misturar suas configurações com as unidades anteriores.

Cada configuração deverá permanecer identificável.

## 8. INTEGRAÇÃO COM O WHATSAPP

A mensagem de finalização deverá apresentar a composição de cada kit individualmente.

Exemplo:

Olá! Gostaria de fazer um pedido na Mespín! 🕯️

*MEU PEDIDO*

*Kit Vela Dupla — 3 unidades*

*Kit 1*
- Vela 1: Lavanda.
- Vela 2: Flor de Laranjeira.

*Kit 2*
- Vela 1: Bambu.
- Vela 2: Verbena Siciliana.

*Kit 3*
- Vela 1: Lavanda.
- Vela 2: Cereja e Macadâmia.

Valor unitário do kit: R$ 70,00.

Subtotal: R$ 210,00.

A mensagem deverá ser gerada dinamicamente a partir dos dados reais do carrinho.

Não resumir os três kits como seis velas sem identificação de agrupamento.

## 9. KITS COM OUTROS TIPOS DE PRODUTOS

A implementação deverá ser genérica.

Não desenvolver uma regra exclusiva para o Kit Vela Dupla.

Exemplo de outro kit:

**Kit Presente Especial**

Composição:
- 1 vela aromática.
- 1 difusor.
- 1 sachê.

Personalização:

- Vela: selecionar aroma.
- Difusor: selecionar aroma.
- Sachê: selecionar aroma, caso aplicável.

O sistema deverá identificar quais componentes possuem personalização e apresentar somente os campos correspondentes.

## 10. VALIDAÇÕES OBRIGATÓRIAS

Antes de permitir adicionar ao carrinho, validar:

- [ ] Todos os componentes obrigatórios foram configurados.
- [ ] Todos os aromas obrigatórios foram selecionados.
- [ ] A quantidade de itens corresponde à composição do kit.
- [ ] Nenhum componente possui seleção inválida.
- [ ] A composição de cada unidade está completa.
- [ ] Os dados de cada kit estão associados à unidade correta.

Se houver alguma pendência, exibir uma mensagem clara indicando qual item precisa ser configurado.

## 11. CRITÉRIOS DE ACEITAÇÃO

- [ ] Suporte a kits com dois ou mais componentes.
- [ ] Composição configurável por produto.
- [ ] Seleção individual de aromas.
- [ ] Limitação de escolhas conforme os componentes do kit.
- [ ] Suporte a componentes de diferentes categorias.
- [ ] Compra de múltiplas unidades do mesmo kit.
- [ ] Personalização independente de cada unidade.
- [ ] Opção de repetir configuração anterior.
- [ ] Carrinho preserva os agrupamentos.
- [ ] Possibilidade de editar uma unidade específica.
- [ ] Mensagem do WhatsApp identifica cada kit e seus componentes.
- [ ] Funcionamento responsivo.
- [ ] Integração com o carrinho existente.
- [ ] Compatibilidade com GitHub Pages.

## 12. ORIENTAÇÃO FINAL AO AGENTE

Implemente essa funcionalidade como uma regra genérica de produtos compostos.

Não trate kits como produtos simples com uma quantidade de aromas.

A unidade de personalização deverá ser cada componente de cada kit.

A estrutura deve permitir que novos kits sejam cadastrados somente por meio dos arquivos de configuração, sem necessidade de criar componentes específicos para cada novo produto.

Preserve a identidade visual da Mespín e integre a funcionalidade à arquitetura existente.

## 13. DECISÕES DE PROJETO (ESCLARECIMENTOS)

Estas decisões complementam e, em caso de conflito, prevalecem sobre as seções anteriores.

1. **Modelo genérico `components`:** substitui `composition`, `allowsAromaSelection`, `availableAromas` e `productType`. Cada componente tem `id`, `name`, `type`, `quantity`, `description` (opcional) e `aroma`, que pode ser `{ mode: "choice", options }` (cliente escolhe), `{ mode: "fixed", value }` (já definido pelo kit) ou `{ mode: "none" }` (sem aroma). `quantity` maior que 1 gera um seletor por unidade ("Vela 1", "Vela 2"). Não há regra específica para nenhum kit.
2. **Kits cadastrados agora:** apenas o Kit Vela Dupla (2 velas, R$ 70,00, com escolha entre os 5 aromas da loja). Os demais kits (Natal e Noël Luxury) ficam como estão até a composição real ser informada.
3. **Limite:** até 10 kits por adição ao carrinho.
4. **Repetição:** caixa "Repetir a configuração do kit anterior" a partir da 2ª unidade, mais o botão "Aplicar o Kit 1 a todos".
5. **Carrinho:** cada adição vira um grupo, e grupos iguais não se fundem. É possível editar ou remover uma unidade, adicionar outra ao grupo ("+ Adicionar unidade") e remover o grupo inteiro. Ao remover a última unidade, o grupo some.
6. **Mensagem para presente:** removida dos kits.
7. **Carrinho antigo:** kits salvos no formato anterior (sem escolha por item) são descartados.
8. **Caixa Personalizada** (página Personalizados): permanece como está, com montagem livre pelo cliente.
9. **Mensagem do WhatsApp:** cada kit é descrito unidade por unidade, sem pontuação final nas linhas, mantendo o formato do restante do pedido.

**RESULTADO ESPERADO:** o cliente consegue comprar vários kits, escolher individualmente os aromas de cada item de cada kit, visualizar todas as configurações no carrinho e enviar um pedido perfeitamente organizado pelo WhatsApp.