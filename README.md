# Loja Mespín — Chamas com Alma

Loja virtual estática (React + TypeScript + Vite) da Mespín. Sem backend: o catálogo é configurado em arquivos do projeto e o pedido é finalizado pelo WhatsApp.

## Executar localmente

```bash
npm install
npm run dev        # http://localhost:5173/LojaMespin2.0/
npm test           # testes (carrinho, mensagem do WhatsApp, busca/filtros)
npm run build      # gera a pasta dist/
npm run preview    # testa o build localmente
```

## Onde configurar cada coisa

| O que | Arquivo |
|---|---|
| WhatsApp, Instagram, textos institucionais, barra superior, slides da home, página de Natal | `src/data/settings.ts` |
| Produtos | `src/data/products.ts` |
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

## Publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages** e escolha **Source: GitHub Actions**.
2. Envie as alterações para a branch `main`; o workflow `.github/workflows/deploy.yml` roda os testes, gera o build e publica.
3. O site fica em `https://lauramspin.github.io/LojaMespin2.0/`.

O `base` do Vite (`vite.config.ts`) é `/LojaMespin2.0/`; se o nome do repositório mudar, atualize-o. As rotas usam `HashRouter` (`#/`, `#/catalogo`, `#/natal`), então não é preciso configurar o servidor.

## Observações

- O carrinho é salvo no LocalStorage do navegador. Nome e CEP do cliente não são armazenados.
- O site não consegue confirmar se a mensagem foi enviada no WhatsApp; por isso o carrinho só é limpo quando o cliente escolhe.
- Frete, disponibilidade final e pagamento são combinados no atendimento.
