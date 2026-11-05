# Loja Mespín — Chamas com Alma

Loja virtual estática (React + TypeScript + Vite) da Mespín. Sem backend: o catálogo é configurado em arquivos do projeto e o pedido é finalizado pelo WhatsApp.

## Executar localmente

```bash
npm install
npm run dev        # http://localhost:5173/
npm test           # testes (carrinho, mensagem do WhatsApp, busca/filtros)
npm run build      # gera a pasta dist/
npm run preview    # testa o build localmente
```

## Onde configurar cada coisa

| O que | Arquivo |
|---|---|
| WhatsApp, Instagram, textos institucionais, barra superior, slides da home, página de Natal, rodapé | `src/data/settings.ts` |
| Produtos | `src/data/products.ts` |
| Produtos personalizados (sob encomenda) | `src/data/customProducts.ts` |
| Página Personalizados (banner, galeria, FAQ) | `src/data/customPage.ts` |
| Categorias | `src/data/categories.ts` |
| Imagens | `public/assets/` (originais em `Assets/`) |

### WhatsApp

Em `src/data/settings.ts`, altere `whatsapp` para o número no formato internacional, somente dígitos: `55` + DDD + número (ex.: `5531984840078`). O site valida o número antes de gerar o link `https://wa.me/...`.

### Cadastrar ou editar um produto

Edite `src/data/products.ts` e copie um item existente:

```ts
{
  id: "vela-aromatica-100g",          // único, sem espaços
  name: "Vela Aromática 100g",
  category: "velas",                  // velas | difusores | sprays | saches | incensos | kits
  description: "Vela em copo patê com 100g aromatizada.",
  image: "assets/products/vela-aromatica-100g.jpg",
  gallery: ["assets/products/outra-foto.jpg"],   // opcional
  price: 32,                          // use null para "Preço sob consulta"
  originalPrice: 40,                  // opcional (preço riscado)
  aromas: ["Lavanda", "Bambu"],       // [] = produto sem escolha de aroma
  available: true,                    // false = "Esgotado" (sem botão de compra)
  featured: true,                     // aparece primeiro na home
  isChristmas: false,                 // true = aparece em #/natal
  badge: "Natal",                     // opcional
  customization: { fields: ["labelName", "giftMessage", "notes"] }, // opcional
  sortOrder: 1                        // ordem de exibição
}
```

- **Preço sob consulta** (`price: null`): o cartão mostra "Consultar", que abre o WhatsApp. Esses produtos não entram no carrinho.
- **Sem imagem**: o site mostra um placeholder com o logotipo.
- Os dados refletem a última publicação; não há sincronização em tempo real de preço ou estoque.

### Atualizar imagens

1. Salve a foto otimizada (JPG, até ~1200 px de largura) em `public/assets/products/`.
2. Aponte `image` do produto para `assets/products/nome-do-arquivo.jpg`.
3. Banners dos slides ficam em `public/assets/banners/` e são configurados em `HERO_SLIDES` (`settings.ts`).

### Cadastrar um produto personalizado (sob encomenda)

Edite `src/data/customProducts.ts`:

```ts
{
  id: "latinhas-personalizadas",     // único
  name: "Latinhas Personalizadas",
  description: "...",
  image: "assets/personalizados/minha-foto.jpg",   // opcional (sem imagem = placeholder)
  kind: "unit",                      // "unit" = itens por aroma | "box" = caixa montada pelo cliente
  available: true,
  minimumQuantity: 10,
  minimumScope: "perAroma",          // "perAroma" = mínimo para cada aroma | "total" = mínimo do pedido
  quantityStep: 1,                   // incremento permitido
  basePrice: 6,                      // reais por unidade; null = "Solicite um orçamento"
  priceFrom: false,                  // true = exibe "A partir de" (ex.: caixa)
  discountTiers: [                   // só cadastre descontos confirmados; [] = sem desconto
    { minQuantity: 50, discount: 5 },
    { minQuantity: 100, discount: 10 }
  ],
  options: {
    aromas: ["Lavanda", "Bambu"],    // [] = sem escolha de aroma
    labelFields: ["names", "date", "message"],  // campos de texto da etiqueta
    packaging: true,
    referenceImage: true,            // "Tenho uma imagem ou referência para enviar"
    notes: true
  },
  productionTime: "15 dias úteis",   // opcional; sem valor = "a confirmar pelo atendimento"
  featured: true,
  sortOrder: 1
}
```

- O desconto usa a **maior faixa aplicável** à quantidade total (não soma faixas). Os cálculos são feitos em centavos.
- O limite de unidades por encomenda (`maxQuantity`) e o teto de desconto estão em `CUSTOM_RULES`, no mesmo arquivo.
- **Caixa personalizada** (`kind: "box"`): o cliente escolhe itens do catálogo (exceto kits) e os outros personalizados. O valor da caixa é `basePrice` + soma dos itens. Item sem preço entra como "valor a combinar".
- Banner, galeria, passo a passo, perguntas frequentes e destaque da home ficam em `src/data/customPage.ts`. Fotos em `public/assets/personalizados/` (originais em `Assets/personalizados/`).
- Encomendas personalizadas ficam no mesmo carrinho dos produtos comuns, identificadas como "Produto sob encomenda", e seguem na mesma mensagem do WhatsApp, em seção própria.

### Cadastrar um kit (produto composto)

Em `src/data/products.ts`, um produto com `components` é tratado como kit. Não é preciso criar componentes React:

```ts
{
  id: "kit-vela-dupla",
  name: "Kit Vela Dupla",
  category: "kits",
  price: 70,                         // preço do kit (cada unidade); null = "Sob consulta"
  aromas: [],
  components: [
    {
      id: "vela",                    // único dentro do kit
      name: "Vela",                  // com quantity 2 vira "Vela 1" e "Vela 2"
      type: "vela",
      quantity: 2,                   // gera um seletor independente por unidade
      aroma: { mode: "choice", options: ["Lavanda", "Bambu"] }
    },
    { id: "difusor", name: "Difusor", type: "difusor", quantity: 1,
      aroma: { mode: "fixed", value: "Eucalipto" } },   // aroma já definido pelo kit
    { id: "sache", name: "Sachê", type: "sache", quantity: 1,
      aroma: { mode: "none" } }                         // item sem aroma
  ],
  // ...demais campos do produto (image, available, featured, sortOrder...)
}
```

- O cliente escolhe o aroma de **cada item de cada kit** e só consegue adicionar ao carrinho com tudo preenchido. Ao comprar vários kits, cada unidade é configurada separadamente (há "Repetir a configuração do kit anterior" e "Aplicar o Kit 1 a todos").
- No carrinho e na mensagem do WhatsApp cada unidade aparece com a sua composição. Dá para editar ou remover uma unidade, adicionar outra ao mesmo grupo ou remover o kit inteiro.
- O limite de kits por compra (`maxKitUnits`, hoje 10) fica em `src/data/settings.ts`.

## Publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages** e escolha **Source: GitHub Actions**.
2. Envie as alterações para a branch `main`; o workflow `.github/workflows/deploy.yml` roda os testes, gera o build e publica.
3. O site fica em `https://mespin.com.br/`.

### Domínio próprio (mespin.com.br)

1. **GitHub:** em **Settings → Pages → Custom domain**, informe `mespin.com.br`, salve e, quando o certificado estiver pronto, marque **Enforce HTTPS**.
2. **Registro.br** (Editar zona DNS do domínio):

| Tipo | Nome | Valor |
|---|---|---|
| A | (raiz, `mespin.com.br`) | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (um registro para cada IP) |
| AAAA | (raiz) | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `lauramspin.github.io.` |

O `base` do Vite (`vite.config.ts`) é `/`, pois o site é servido na raiz do domínio. As rotas usam `HashRouter` (`#/`, `#/catalogo`, `#/natal`), então não é preciso configurar o servidor.

## Observações

- O carrinho é salvo no LocalStorage do navegador. Nome e CEP do cliente não são armazenados.
- O site não consegue confirmar se a mensagem foi enviada no WhatsApp; por isso o carrinho só é limpo quando o cliente escolhe.
- Frete, disponibilidade final e pagamento são combinados no atendimento.
