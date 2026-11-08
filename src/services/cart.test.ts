import { describe, expect, it } from "vitest";
import {
  cartCount,
  cartReducer,
  cartTotal,
  createLine,
  getCartDetails,
  parseStoredCart,
  startingPrice
} from "./cart";
import type { Product } from "../types";

const product = (over: Partial<Product>): Product => ({
  id: "p1",
  name: "Vela",
  category: "velas",
  description: "",
  price: 32,
  aromas: ["Lavanda", "Bambu"],
  available: true,
  featured: false,
  isChristmas: false,
  sortOrder: 1,
  ...over
});

describe("cartReducer", () => {
  it("soma linhas iguais (produto + aroma + personalização)", () => {
    let state = cartReducer([], { type: "add", lines: [createLine("p1", "Lavanda", 2)], max: 99 });
    state = cartReducer(state, { type: "add", lines: [createLine("p1", "Lavanda", 1)], max: 99 });
    expect(state).toHaveLength(1);
    expect(state[0].quantity).toBe(3);
  });

  it("mantém aromas e personalizações diferentes em linhas separadas", () => {
    let state = cartReducer([], {
      type: "add",
      lines: [createLine("p1", "Lavanda", 2), createLine("p1", "Bambu", 1)],
      max: 99
    });
    state = cartReducer(state, {
      type: "add",
      lines: [createLine("p1", "Lavanda", 1, { giftMessage: "Parabéns" })],
      max: 99
    });
    expect(state).toHaveLength(3);
  });

  it("ignora espaços e campos vazios na personalização ao montar a chave", () => {
    const a = createLine("p1", null, 1, { notes: "  oi  ", labelName: "   " });
    const b = createLine("p1", null, 1, { notes: "oi" });
    expect(a.key).toBe(b.key);
  });

  it("limita a quantidade máxima por linha", () => {
    let state = cartReducer([], { type: "add", lines: [createLine("p1", null, 98)], max: 99 });
    state = cartReducer(state, { type: "add", lines: [createLine("p1", null, 10)], max: 99 });
    expect(state[0].quantity).toBe(99);
  });

  it("não adiciona quantidade zero", () => {
    expect(cartReducer([], { type: "add", lines: [createLine("p1", null, 0)], max: 99 })).toEqual([]);
  });

  it("altera quantidade e remove quando chega a zero", () => {
    const line = createLine("p1", "Lavanda", 2);
    let state = cartReducer([line], { type: "setQuantity", key: line.key, quantity: 5, max: 99 });
    expect(state[0].quantity).toBe(5);
    state = cartReducer(state, { type: "setQuantity", key: line.key, quantity: 0, max: 99 });
    expect(state).toEqual([]);
  });

  it("remove e limpa", () => {
    const a = createLine("p1", "Lavanda", 1);
    const b = createLine("p1", "Bambu", 1);
    expect(cartReducer([a, b], { type: "remove", key: a.key })).toEqual([b]);
    expect(cartReducer([a, b], { type: "clear" })).toEqual([]);
  });
});

describe("getCartDetails / totais", () => {
  it("calcula subtotais, total e contagem", () => {
    const lines = [createLine("p1", "Lavanda", 2), createLine("p1", "Bambu", 1), createLine("p2", null, 1)];
    const products = [product({}), product({ id: "p2", price: 70.1 })];
    const details = getCartDetails(lines, products);
    expect(details.map((d) => d.subtotal)).toEqual([64, 32, 70.1]);
    expect(cartTotal(details)).toBe(166.1);
    expect(cartCount(details)).toBe(4);
  });

  it("ignora produtos removidos, esgotados ou sem preço", () => {
    const lines = [createLine("a", null, 1), createLine("b", null, 1), createLine("c", null, 1), createLine("d", null, 1)];
    const products = [
      product({ id: "a" }),
      product({ id: "b", available: false }),
      product({ id: "c", price: null })
    ];
    expect(getCartDetails(lines, products).map((d) => d.product.id)).toEqual(["a"]);
  });

  it("evita erro de ponto flutuante", () => {
    const details = getCartDetails([createLine("p1", null, 3)], [product({ price: 0.1 })]);
    expect(cartTotal(details)).toBe(0.3);
  });
});

describe("parseStoredCart", () => {
  it("recupera linhas válidas", () => {
    const raw = JSON.stringify([createLine("p1", "Lavanda", 2, { notes: "x" })]);
    const lines = parseStoredCart(raw);
    expect(lines).toHaveLength(1);
    expect(lines[0].customization).toEqual({ notes: "x" });
  });

  it("descarta dados inválidos", () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart("não é json")).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
    expect(parseStoredCart('[{"productId":1,"quantity":2},{"productId":"x","quantity":0}]')).toEqual([]);
  });
});

describe("variantes (tamanhos com preço próprio)", () => {
  const refil = product({
    id: "refil-vela",
    category: "refil",
    price: 25,
    variants: [
      { id: "100g", label: "100g", price: 25 },
      { id: "200g", label: "200g", price: 40 }
    ]
  });

  it("cobra o preço da variante escolhida", () => {
    const details = getCartDetails(
      [createLine("refil-vela", "Lavanda", 2, {}, "200g"), createLine("refil-vela", "Lavanda", 1, {}, "100g")],
      [refil]
    );
    expect(details.map((d) => [d.variant?.label, d.unitPrice, d.subtotal])).toEqual([
      ["200g", 40, 80],
      ["100g", 25, 25]
    ]);
    expect(cartTotal(details)).toBe(105);
  });

  it("tamanhos diferentes do mesmo aroma ficam em linhas separadas; iguais somam", () => {
    let state = cartReducer([], {
      type: "add",
      lines: [createLine("refil-vela", "Lavanda", 1, {}, "100g"), createLine("refil-vela", "Lavanda", 1, {}, "200g")],
      max: 99
    });
    state = cartReducer(state, { type: "add", lines: [createLine("refil-vela", "Lavanda", 2, {}, "200g")], max: 99 });
    expect(state.map((l) => [l.variantId, l.quantity])).toEqual([
      ["100g", 1],
      ["200g", 3]
    ]);
  });

  it("ignora linha sem variante válida e preserva a variante ao reler o carrinho salvo", () => {
    expect(getCartDetails([createLine("refil-vela", "Lavanda", 1)], [refil])).toEqual([]);
    expect(getCartDetails([createLine("refil-vela", "Lavanda", 1, {}, "500g")], [refil])).toEqual([]);
    const saved = JSON.stringify([createLine("refil-vela", "Lavanda", 2, {}, "200g")]);
    expect(parseStoredCart(saved)[0].variantId).toBe("200g");
  });

  it("o menor preço é o da variante mais barata", () => {
    expect(startingPrice(refil)).toBe(25);
    expect(startingPrice(product({ price: 32 }))).toBe(32);
  });
});
