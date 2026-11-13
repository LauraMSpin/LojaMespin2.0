import { describe, expect, it } from "vitest";
import {
  computeCustomOrder,
  createCustomLine,
  customCartReducer,
  customHasPending,
  customTotalCents,
  discountFor,
  getBoxSources,
  getCustomDetails,
  parseStoredCustomCart,
  validateCustomLine
} from "./customOrders";
import { buildOrderMessage } from "./whatsapp";
import { CUSTOM_PRODUCTS } from "../data/customProducts";
import { PRODUCTS } from "../data/products";
import type { CustomProduct, Product } from "../types";

// Item sem preço fixo apenas para teste (o catálogo real pode mudar)
const SEM_PRECO: Product = {
  id: "difusor-ultrassonico-premium",
  name: "Difusor Ultrassônico Premium",
  category: "difusores",
  description: "",
  image: "",
  price: null,
  aromas: [],
  available: true,
  featured: false,
  isChristmas: false,
  sortOrder: 99
};
const TEST_CATALOG: Product[] = [...PRODUCTS, SEM_PRECO];

const latinha = CUSTOM_PRODUCTS.find((p) => p.id === "latinhas-personalizadas") as CustomProduct;
const copinho = CUSTOM_PRODUCTS.find((p) => p.id === "copinho-50ml-personalizado") as CustomProduct;
const caixa = CUSTOM_PRODUCTS.find((p) => p.id === "caixa-personalizada") as CustomProduct;

const withTiers: CustomProduct = {
  ...latinha,
  basePrice: 10,
  minimumQuantity: 20,
  minimumScope: "total",
  discountTiers: [
    { minQuantity: 50, discount: 5 },
    { minQuantity: 100, discount: 10 },
    { minQuantity: 200, discount: 15 }
  ]
};

describe("quantidade mínima", () => {
  it("exige o mínimo por aroma", () => {
    const ok = createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 10 }, { aroma: "Bambu", quantity: 10 }] });
    expect(validateCustomLine(ok, latinha)).toEqual([]);
    const bad = createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 10 }, { aroma: "Bambu", quantity: 9 }] });
    expect(validateCustomLine(bad, latinha)).toEqual(["Bambu: mínimo de 10 unidades por aroma."]);
  });

  it("cada produto tem o seu mínimo", () => {
    const line = createCustomLine({ productId: copinho.id, units: [{ aroma: "Lavanda", quantity: 5 }] });
    expect(validateCustomLine(line, copinho)).toEqual([]);
    expect(validateCustomLine(createCustomLine({ productId: copinho.id, units: [{ aroma: "Lavanda", quantity: 4 }] }), copinho)).toHaveLength(1);
  });

  it("pede ao menos um aroma e rejeita aroma inexistente", () => {
    expect(validateCustomLine(createCustomLine({ productId: latinha.id, units: [] }), latinha)[0]).toMatch(/Escolha ao menos um aroma/);
    const line = createCustomLine({ productId: latinha.id, units: [{ aroma: "Inexistente", quantity: 10 }] });
    expect(validateCustomLine(line, latinha)).toEqual(["Aroma indisponível para este produto."]);
  });

  it("respeita mínimo total, incremento e limite máximo", () => {
    const total = { ...latinha, minimumScope: "total" as const, minimumQuantity: 20 };
    const line = createCustomLine({ productId: total.id, units: [{ aroma: "Lavanda", quantity: 12 }, { aroma: "Bambu", quantity: 10 }] });
    expect(validateCustomLine(line, total)).toEqual([]);
    const stepped = { ...latinha, quantityStep: 5 };
    expect(validateCustomLine(createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 12 }] }), stepped)).toHaveLength(1);
    expect(validateCustomLine(createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 1000 }] }), latinha)).toHaveLength(1);
  });

  it("caixa: mínimo de 1 e pelo menos um item", () => {
    const empty = createCustomLine({ productId: caixa.id, units: [{ aroma: null, quantity: 1 }] });
    expect(validateCustomLine(empty, caixa)).toEqual(["Escolha ao menos um item para a caixa."]);
    const ok = createCustomLine({ productId: caixa.id, units: [{ aroma: null, quantity: 1 }], boxItems: [{ source: "catalog", refId: "vela-aromatica:100g", aroma: null, quantity: 1 }] });
    expect(validateCustomLine(ok, caixa)).toEqual([]);
  });
});

describe("descontos progressivos", () => {
  it("usa a maior faixa aplicável, sem somar faixas", () => {
    expect(discountFor(withTiers, 20)).toBe(0);
    expect(discountFor(withTiers, 49)).toBe(0);
    expect(discountFor(withTiers, 50)).toBe(5);
    expect(discountFor(withTiers, 99)).toBe(5);
    expect(discountFor(withTiers, 100)).toBe(10);
    expect(discountFor(withTiers, 250)).toBe(15);
  });

  it("não permite desconto negativo nem acima do teto", () => {
    const odd = { ...withTiers, discountTiers: [{ minQuantity: 1, discount: -5 }] };
    expect(discountFor(odd, 10)).toBe(0);
    const high = { ...withTiers, discountTiers: [{ minQuantity: 1, discount: 90 }] };
    expect(discountFor(high, 10)).toBe(50);
  });

  it("calcula preço final, subtotal e economia em centavos", () => {
    const line = createCustomLine({ productId: withTiers.id, units: [{ aroma: "Lavanda", quantity: 100 }] });
    const d = computeCustomOrder(line, withTiers);
    expect(d.unitCents).toBe(1000);
    expect(d.discountPercent).toBe(10);
    expect(d.finalUnitCents).toBe(900);
    expect(d.subtotalCents).toBe(90000);
    expect(d.savingsCents).toBe(10000);
  });

  it("sem faixas cadastradas não há desconto", () => {
    const noTiers = { ...latinha, discountTiers: [] };
    const line = createCustomLine({ productId: noTiers.id, units: [{ aroma: "Lavanda", quantity: 500 }] });
    const d = computeCustomOrder(line, noTiers);
    expect(d.subtotalCents).toBe(300000);
    expect(d.savingsCents).toBe(0);
  });

  it("preço indefinido pede orçamento e não inventa valor", () => {
    const noPrice = { ...latinha, basePrice: null };
    const d = computeCustomOrder(createCustomLine({ productId: noPrice.id, units: [{ aroma: "Lavanda", quantity: 10 }] }), noPrice);
    expect(d.unitCents).toBeNull();
    expect(d.subtotalCents).toBeNull();
    expect(customHasPending([d])).toBe(true);
  });
});

describe("caixa personalizada", () => {
  const sources = getBoxSources(TEST_CATALOG);

  it("soma o valor de cada item ao valor base", () => {
    const line = createCustomLine({
      productId: caixa.id,
      units: [{ aroma: null, quantity: 2 }],
      boxItems: [
        { source: "catalog", refId: "vela-aromatica:100g", aroma: "Lavanda", quantity: 2 },
        { source: "custom", refId: "latinhas-personalizadas", aroma: "Bambu", quantity: 3 }
      ]
    });
    const d = computeCustomOrder(line, caixa, sources);
    expect(d.unitCents).toBe(3000 + 2 * 3600 + 3 * 600);
    expect(d.subtotalCents).toBe(d.unitCents! * 2);
    expect(d.isFrom).toBe(true);
    expect(d.pendingItems).toEqual([]);
  });

  it("item sem preço entra 'a combinar' e fica registrado", () => {
    const line = createCustomLine({
      productId: caixa.id,
      units: [{ aroma: null, quantity: 1 }],
      boxItems: [{ source: "catalog", refId: "difusor-ultrassonico-premium", aroma: null, quantity: 1 }]
    });
    const d = computeCustomOrder(line, caixa, sources);
    expect(d.unitCents).toBe(3000);
    expect(d.pendingItems).toEqual(["Difusor Ultrassônico Premium"]);
  });

  it("não oferece kits nem personalizados do tipo caixa como item", () => {
    expect(sources.some((s) => s.refId === "caixa-personalizada")).toBe(false);
    expect(sources.some((s) => s.source === "catalog" && PRODUCTS.find((p) => p.id === s.refId)?.category === "kits")).toBe(false);
  });
});

describe("carrinho de personalizados", () => {
  it("cada configuração é um item independente", () => {
    const a = createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 10 }] });
    const b = createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 10 }] });
    expect(a.key).not.toBe(b.key);
    const state = customCartReducer(customCartReducer([], { type: "add", line: a }), { type: "add", line: b });
    expect(state).toHaveLength(2);
  });

  it("edita preservando a posição e remove", () => {
    const a = createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 10 }] });
    const b = createCustomLine({ productId: latinha.id, units: [{ aroma: "Bambu", quantity: 10 }] });
    const edited = createCustomLine({ productId: latinha.id, units: [{ aroma: "Bambu", quantity: 20 }], notes: "novo" });
    let state = customCartReducer([a, b], { type: "replace", key: a.key, line: edited });
    expect(state[0].key).toBe(a.key);
    expect(state[0].units[0].quantity).toBe(20);
    state = customCartReducer(state, { type: "remove", key: b.key });
    expect(state).toHaveLength(1);
    expect(customCartReducer(state, { type: "clear" })).toEqual([]);
  });

  it("recupera do LocalStorage e descarta dados inválidos", () => {
    const line = createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 10 }], label: { names: " Maria " }, hasReference: true });
    const parsed = parseStoredCustomCart(JSON.stringify([line]));
    expect(parsed).toEqual([line]);
    expect(parsed[0].label.names).toBe("Maria");
    expect(parseStoredCustomCart("lixo")).toEqual([]);
    expect(parseStoredCustomCart('[{"key":"x","productId":"y","units":[{"quantity":0}]}]')).toEqual([]);
  });

  it("ignora produtos removidos ou indisponíveis", () => {
    const lines = [createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 10 }] }), createCustomLine({ productId: "sumiu", units: [{ aroma: null, quantity: 1 }] })];
    expect(getCustomDetails(lines).map((d) => d.product.id)).toEqual([latinha.id]);
    expect(getCustomDetails(lines, [{ ...latinha, available: false }])).toEqual([]);
  });
});

describe("mensagem do WhatsApp com personalizados", () => {
  const customer = { name: "Maria Silva", cep: "30100000" };

  it("monta orçamento só de personalizados", () => {
    const lines = [
      createCustomLine({ productId: latinha.id, units: [{ aroma: "Lavanda", quantity: 10 }, { aroma: "Bambu", quantity: 12 }], label: { names: "Maria e Eduardo", date: "15/05/2027" }, hasReference: true, notes: "Casamento" })
    ];
    const details = getCustomDetails(lines);
    const msg = buildOrderMessage(customer, [], 0, details);
    expect(msg).toContain("solicitar um orçamento de produtos personalizados");
    expect(msg).toContain("*PRODUTOS PERSONALIZADOS*");
    expect(msg).toContain("1. Latinhas Personalizadas\n- Lavanda: 10 unidades\n- Bambu: 12 unidades\n- Quantidade total: 22 unidades");
    expect(msg).toContain("- Nome ou nomes: Maria e Eduardo");
    expect(msg).toContain("- Data: 15/05/2027");
    expect(msg).toContain("- Tenho uma imagem ou referência para enviar pelo WhatsApp.");
    expect(msg).toContain("Preço unitário: R$ 6,00");
    expect(msg).toContain("Subtotal estimado: R$ 132,00");
    expect(msg).toContain("*TOTAL ESTIMADO: R$ 132,00*");
    expect(msg).not.toContain("*MEU PEDIDO*");
    expect(msg).not.toMatch(/undefined|null|\u00a0/);
  });

  it("mistura pedido comum e personalizado com seções separadas", () => {
    const standard = [{ line: { key: "k", productId: "p", aroma: "Lavanda", quantity: 1, customization: {} }, product: PRODUCTS[0], unitPrice: 32, subtotal: 32 }];
    const custom = getCustomDetails([createCustomLine({ productId: copinho.id, units: [{ aroma: "Lavanda", quantity: 5 }] })]);
    const msg = buildOrderMessage(customer, standard, 32, custom);
    expect(msg).toContain("*MEU PEDIDO*");
    expect(msg).toContain("*PRODUTOS PERSONALIZADOS*");
    expect(msg).toContain("Subtotal dos produtos: R$ 32,00");
    expect(msg).toContain("*TOTAL ESTIMADO: R$ 137,00*");
  });

  it("caixa: lista itens e usa 'a partir de'", () => {
    const line = createCustomLine({
      productId: caixa.id,
      units: [{ aroma: null, quantity: 1 }],
      boxItems: [
        { source: "catalog", refId: "vela-aromatica:100g", aroma: "Lavanda", quantity: 1 },
        { source: "catalog", refId: "difusor-ultrassonico-premium", aroma: null, quantity: 1 }
      ]
    });
    const details = getCustomDetails([line], CUSTOM_PRODUCTS, TEST_CATALOG);
    const msg = buildOrderMessage(customer, [], 0, details);
    expect(msg).toContain("- Quantidade de caixas: 1");
    expect(msg).toContain("• 1x Vela Aromática 100g (Lavanda) — R$ 36,00");
    expect(msg).toContain("• 1x Difusor Ultrassônico Premium — valor a combinar");
    expect(msg).toContain("Preço da caixa: a partir de R$ 66,00");
    expect(msg).toContain("Itens com valor a combinar: Difusor Ultrassônico Premium");
    expect(customTotalCents(details)).toBe(6600);
  });

  it("sem personalizados mantém a mensagem original", () => {
    const standard = [{ line: { key: "k", productId: "p", aroma: null, quantity: 2, customization: {} }, product: PRODUCTS[0], unitPrice: 32, subtotal: 64 }];
    const msg = buildOrderMessage(customer, standard, 64);
    expect(msg.startsWith("Olá! Gostaria de realizar um pedido na Mespín!")).toBe(true);
    expect(msg).toContain("*TOTAL DOS PRODUTOS: R$ 64,00*");
    expect(msg.endsWith("Aguardo as informações para finalizar a compra. Obrigada!")).toBe(true);
  });
});

describe("tamanhos em personalizados", () => {
  const vela = CUSTOM_PRODUCTS.find((p) => p.id === "vela-personalizada") as CustomProduct;

  it("cada unidade usa o preço do seu tamanho", () => {
    const line = createCustomLine({
      productId: vela.id,
      units: [
        { aroma: "Lavanda", variantId: "100g", quantity: 2 },
        { aroma: "Lavanda", variantId: "200g", quantity: 1 }
      ]
    });
    const order = computeCustomOrder(line, vela);
    const price = (id: string) => Math.round((vela.variants?.find((v) => v.id === id)?.price ?? 0) * 100);
    expect(order.subtotalCents).toBe(2 * price("100g") + price("200g"));
    expect(validateCustomLine(line, vela)).toEqual([]);
  });

  it("recusa unidade sem tamanho válido", () => {
    const line = createCustomLine({ productId: vela.id, units: [{ aroma: "Lavanda", quantity: 1 }] });
    expect(validateCustomLine(line, vela)).toContain("Tamanho indisponível para este produto.");
  });

  it("preserva o tamanho ao ler o carrinho salvo", () => {
    const line = createCustomLine({
      productId: vela.id,
      units: [{ aroma: "Lavanda", variantId: "200g", quantity: 1 }]
    });
    const [back] = parseStoredCustomCart(JSON.stringify([line]));
    expect(back.units[0].variantId).toBe("200g");
  });
});
