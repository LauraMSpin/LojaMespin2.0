import { describe, expect, it } from "vitest";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  formatCep,
  isValidCep,
  isValidWhatsAppNumber,
  validateCustomer
} from "./whatsapp";
import { cartTotal, createLine, getCartDetails } from "./cart";
import type { Product } from "../types";

const velas: Product = {
  id: "vela",
  name: "Vela Aromática 100g",
  category: "velas",
  description: "",
  price: 32,
  aromas: ["Lavanda", "Verbena Siciliana"],
  available: true,
  featured: false,
  isChristmas: false,
  sortOrder: 1
};
const kit: Product = { ...velas, id: "kit", name: "Kit Vela Dupla", price: 70, aromas: [] };

describe("validações", () => {
  it("valida número de WhatsApp", () => {
    expect(isValidWhatsAppNumber("5531984840078")).toBe(true);
    expect(isValidWhatsAppNumber("5500000000000")).toBe(false);
    expect(isValidWhatsAppNumber("(31) 98484-0078")).toBe(false);
    expect(isValidWhatsAppNumber("123")).toBe(false);
  });

  it("valida e formata CEP", () => {
    expect(isValidCep("30100-000")).toBe(true);
    expect(isValidCep("30100000")).toBe(true);
    expect(isValidCep("3010")).toBe(false);
    expect(formatCep("30100000")).toBe("30100-000");
    expect(formatCep("3010")).toBe("3010");
  });

  it("exige nome completo e CEP", () => {
    expect(validateCustomer({ name: "Maria", cep: "30100-000" }).name).toBeDefined();
    expect(validateCustomer({ name: "Maria Silva", cep: "123" }).cep).toBeDefined();
    expect(validateCustomer({ name: "Maria Silva", cep: "30100-000" })).toEqual({});
  });
});

describe("buildOrderMessage", () => {
  const lines = [
    createLine("vela", "Lavanda", 2),
    createLine("vela", "Verbena Siciliana", 1),
    createLine("kit", null, 1, { giftMessage: "Feliz aniversário!" })
  ];
  const details = getCartDetails(lines, [velas, kit]);
  const total = cartTotal(details);
  const message = buildOrderMessage({ name: " Maria Silva ", cep: "30100000" }, details, total);

  it("monta a mensagem estruturada com dados reais do carrinho", () => {
    expect(message).toContain("Nome: Maria Silva");
    expect(message).toContain("CEP: 30100-000");
    expect(message).toContain("1. Vela Aromática 100g\n- Lavanda: 2 unidades\n- Verbena Siciliana: 1 unidade\nValor: R$ 96,00");
    expect(message).toContain("2. Kit Vela Dupla\n- Quantidade: 1\n- Mensagem para presente: Feliz aniversário!\nValor: R$ 70,00");
    expect(message).toContain("Subtotal: R$ 166,00");
    expect(message).toContain("Frete: A combinar");
    expect(message).toContain("*TOTAL DOS PRODUTOS: R$ 166,00*");
  });

  it("não contém NBSP nem undefined/null", () => {
    expect(message).not.toMatch(/\u00a0/);
    expect(message).not.toMatch(/undefined|null/);
  });
});

describe("buildWhatsAppUrl", () => {
  it("codifica a mensagem", () => {
    const url = buildWhatsAppUrl("5531984840078", "Olá & tudo\nbem?");
    expect(url).toBe("https://wa.me/5531984840078?text=Ol%C3%A1%20%26%20tudo%0Abem%3F");
  });

  it("retorna null para número inválido", () => {
    expect(buildWhatsAppUrl("5500000000000", "oi")).toBeNull();
  });
});

describe("pedido com variantes (tamanho)", () => {
  const refil: Product = {
    ...velas,
    id: "refil",
    name: "Refil de Vela",
    category: "refil",
    variants: [
      { id: "100g", label: "100g", price: 25 },
      { id: "200g", label: "200g", price: 40 }
    ]
  };

  it("separa os tamanhos e informa o escolhido em cada item", () => {
    const details = getCartDetails(
      [createLine("refil", "Lavanda", 2, {}, "200g"), createLine("refil", "Bambu", 1, {}, "100g")],
      [refil]
    );
    const message = buildOrderMessage({ name: "Maria Silva", cep: "30100000" }, details, cartTotal(details));
    expect(message).toContain("1. Refil de Vela (200g)");
    expect(message).toContain("2. Refil de Vela (100g)");
    expect(message).toContain("- Lavanda: 2 unidades");
    expect(message).toContain("Valor: R$ 80,00");
    expect(message).toContain("Valor: R$ 25,00");
  });
});
