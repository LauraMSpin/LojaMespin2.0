import { describe, expect, it } from "vitest";
import {
  copySelections,
  createKitGroup,
  createUnit,
  getKitDetails,
  getSlots,
  kitCartReducer,
  kitTotal,
  kitUnitCount,
  matchesPrevious,
  parseStoredKitCart,
  validateKitGroup,
  validateUnit
} from "./kits";
import { getCartDetails, createLine } from "./cart";
import { requiresSelection, productAromas } from "./catalog";
import { buildOrderMessage } from "./whatsapp";
import { PRODUCTS } from "../data/products";
import type { Product } from "../types";

const dupla = PRODUCTS.find((p) => p.id === "kit-vela-dupla") as Product;

const presente: Product = {
  id: "kit-presente-teste",
  name: "Kit Presente Especial",
  category: "kits",
  description: "",
  price: 120,
  aromas: [],
  available: true,
  featured: false,
  isChristmas: false,
  sortOrder: 99,
  components: [
    { id: "vela", name: "Vela", type: "vela", quantity: 1, aroma: { mode: "choice", options: ["Lavanda", "Bambu"] } },
    { id: "difusor", name: "Difusor", type: "difusor", quantity: 1, aroma: { mode: "fixed", value: "Eucalipto" } },
    { id: "sache", name: "Sachê", type: "sache", quantity: 1, aroma: { mode: "none" } }
  ]
};

const unit = (a: string, b: string, id?: string) => createUnit({ "vela:1": a, "vela:2": b }, id);

describe("composição genérica (components)", () => {
  it("expande o componente em seletores independentes", () => {
    expect(getSlots(dupla).map((s) => [s.id, s.name])).toEqual([
      ["vela:1", "Vela 1"],
      ["vela:2", "Vela 2"]
    ]);
  });

  it("kit com tipos diferentes só pede escolha onde há escolha", () => {
    expect(getSlots(presente).map((s) => s.name)).toEqual(["Vela", "Difusor", "Sachê"]);
    expect(validateUnit(presente, createUnit())).toEqual(["Kit — Vela: selecione o aroma."]);
    expect(validateUnit(presente, createUnit({ "vela:1": "Bambu" }))).toEqual([]);
  });

  it("o Kit Vela Dupla do catálogo é um kit e exige escolha", () => {
    expect(requiresSelection(dupla)).toBe(true);
    expect(productAromas(dupla)).toContain("Cereja & Macadâmia");
    expect(dupla.aromas).toEqual([]);
  });
});

describe("aroma por unidade (aromas)", () => {
  const trio: Product = {
    ...presente,
    id: "kit-trio-teste",
    components: [
      {
        id: "vela",
        name: "Vela",
        type: "vela",
        quantity: 3,
        aroma: { mode: "choice", options: ["Lavanda", "Bambu"] },
        aromas: [{ mode: "fixed", value: "Bosque Natalino" }, { mode: "fixed", value: "Aconchego do Noel" }]
      }
    ]
  };

  it("cada unidade pode ter um aroma fixo diferente; as demais usam o aroma do item", () => {
    const slots = getSlots(trio);
    expect(slots.map((s) => s.aroma.mode)).toEqual(["fixed", "fixed", "choice"]);
    const group = createKitGroup({ productId: trio.id, units: [createUnit({ "vela:3": "Bambu" })] });
    const [detail] = getKitDetails([group], [trio]);
    expect(detail.units[0].items.map((i) => [i.name, i.value])).toEqual([
      ["Vela 1", "Bosque Natalino"],
      ["Vela 2", "Aconchego do Noel"],
      ["Vela 3", "Bambu"]
    ]);
  });

  it("só exige escolha nas unidades sem aroma definido", () => {
    expect(validateUnit(trio, createUnit())).toEqual(["Kit — Vela 3: selecione o aroma."]);
    expect(validateUnit(trio, createUnit({ "vela:3": "Bambu" }))).toEqual([]);
  });

  it("os aromas definidos entram na busca do catálogo", () => {
    expect(productAromas(trio)).toEqual(expect.arrayContaining(["Bosque Natalino", "Aconchego do Noel", "Lavanda"]));
  });
});

describe("validações", () => {
  it("exige um aroma por vela e cita o item pendente", () => {
    const errors = validateKitGroup(dupla, [unit("Lavanda", ""), createUnit({ "vela:1": "Bambu", "vela:2": "Lavanda" })]);
    expect(errors).toEqual(["Kit 1 — Vela 2: selecione o aroma."]);
  });

  it("rejeita aroma fora das opções, repete aroma permitido", () => {
    expect(validateUnit(dupla, unit("Lavanda", "Lavanda"))).toEqual([]);
    expect(validateUnit(dupla, unit("Lavanda", "Inexistente"))).toEqual(["Kit — Vela 2: aroma indisponível."]);
  });

  it("limita a quantidade de kits", () => {
    const full = Array.from({ length: 11 }, () => unit("Lavanda", "Bambu"));
    expect(validateKitGroup(dupla, full)).toEqual(["Máximo de 10 kits por compra."]);
    expect(validateKitGroup(dupla, [])).toEqual(["Escolha ao menos 1 kit."]);
    expect(validateKitGroup(dupla, full.slice(0, 10))).toEqual([]);
  });
});

describe("repetir configuração", () => {
  it("copia as escolhas do kit anterior mantendo o id da unidade", () => {
    const first = unit("Lavanda", "Bambu");
    const copy = copySelections(dupla, first, "alvo");
    expect(copy.id).toBe("alvo");
    expect(copy.selections).toEqual(first.selections);
    expect(copy.selections).not.toBe(first.selections);
  });

  it("identifica unidade igual à anterior e completa", () => {
    const first = unit("Lavanda", "Bambu");
    expect(matchesPrevious(dupla, first, unit("Lavanda", "Bambu"))).toBe(true);
    expect(matchesPrevious(dupla, first, unit("Lavanda", "Lavanda"))).toBe(false);
    expect(matchesPrevious(dupla, first, createUnit())).toBe(false);
    expect(matchesPrevious(dupla, undefined, first)).toBe(false);
  });
});

describe("carrinho de kits", () => {
  const group = createKitGroup({ productId: dupla.id, units: [unit("Lavanda", "Flor de Laranjeira", "a"), unit("Bambu", "Verbena Siciliana", "b"), unit("Lavanda", "Cereja & Macadâmia", "c")] });

  it("preserva a composição de cada unidade", () => {
    const [detail] = getKitDetails([group]);
    expect(detail.units.map((u) => u.label)).toEqual(["Kit 1", "Kit 2", "Kit 3"]);
    expect(detail.units[1].items).toEqual([
      { name: "Vela 1", value: "Bambu" },
      { name: "Vela 2", value: "Verbena Siciliana" }
    ]);
    expect(detail.unitPrice).toBe(70);
    expect(detail.subtotal).toBe(210);
    expect(kitTotal([detail])).toBe(210);
    expect(kitUnitCount([detail])).toBe(3);
  });

  it("adições iguais não se fundem", () => {
    const again = createKitGroup({ productId: dupla.id, units: [unit("Lavanda", "Flor de Laranjeira")] });
    const state = kitCartReducer(kitCartReducer([], { type: "add", group }), { type: "add", group: again });
    expect(state).toHaveLength(2);
    expect(state[0].key).not.toBe(state[1].key);
  });

  it("remove uma unidade e o grupo some ao ficar vazio", () => {
    let state = kitCartReducer([group], { type: "removeUnit", key: group.key, unitId: "b" });
    expect(state[0].units.map((u) => u.id)).toEqual(["a", "c"]);
    state = kitCartReducer(state, { type: "removeUnit", key: group.key, unitId: "a" });
    state = kitCartReducer(state, { type: "removeUnit", key: group.key, unitId: "c" });
    expect(state).toEqual([]);
  });

  it("edita o grupo preservando a chave e remove o kit inteiro", () => {
    const edited = createKitGroup({ productId: dupla.id, units: [unit("Bambu", "Bambu")] });
    let state = kitCartReducer([group], { type: "replace", key: group.key, group: edited });
    expect(state[0].key).toBe(group.key);
    expect(state[0].units).toHaveLength(1);
    state = kitCartReducer(state, { type: "removeGroup", key: group.key });
    expect(state).toEqual([]);
  });

  it("recupera do LocalStorage e descarta dados inválidos", () => {
    expect(parseStoredKitCart(JSON.stringify([group]))).toEqual([group]);
    expect(parseStoredKitCart("lixo")).toEqual([]);
    expect(parseStoredKitCart('[{"key":"x","productId":"y","units":[{"id":1}]}]')).toEqual([]);
  });

  it("descarta unidades inválidas, kits removidos ou sem preço", () => {
    const broken = createKitGroup({ productId: dupla.id, units: [unit("Lavanda", "Inexistente", "z"), unit("Bambu", "Bambu", "ok")] });
    const [detail] = getKitDetails([broken]);
    expect(detail.units.map((u) => u.unit.id)).toEqual(["ok"]);
    expect(getKitDetails([createKitGroup({ productId: "sumiu", units: [unit("Lavanda", "Bambu")] })])).toEqual([]);
    expect(getKitDetails([group], [{ ...dupla, price: null }])).toEqual([]);
  });

  it("o carrinho comum ignora linhas antigas de kits", () => {
    const legacy = [createLine(dupla.id, "Lavanda", 2), createLine("vela-aromatica-100g", "Lavanda", 1)];
    expect(getCartDetails(legacy, PRODUCTS).map((d) => d.product.id)).toEqual(["vela-aromatica-100g"]);
  });
});

describe("mensagem do WhatsApp com kits", () => {
  const customer = { name: "Maria Silva", cep: "30100000" };
  const group = createKitGroup({ productId: dupla.id, units: [unit("Lavanda", "Flor de Laranjeira"), unit("Bambu", "Verbena Siciliana"), unit("Lavanda", "Cereja & Macadâmia")] });

  it("descreve cada kit individualmente, sem somar como seis velas", () => {
    const kits = getKitDetails([group]);
    const msg = buildOrderMessage(customer, [], 210, [], kits);
    expect(msg).toContain("*MEU PEDIDO*");
    expect(msg).toContain("1. Kit Vela Dupla — 3 unidades");
    expect(msg).toContain("*Kit 1*\n- Vela 1: Lavanda\n- Vela 2: Flor de Laranjeira");
    expect(msg).toContain("*Kit 2*\n- Vela 1: Bambu\n- Vela 2: Verbena Siciliana");
    expect(msg).toContain("*Kit 3*\n- Vela 1: Lavanda\n- Vela 2: Cereja & Macadâmia");
    expect(msg).toContain("Valor unitário do kit: R$ 70,00");
    expect(msg).toContain("Valor: R$ 210,00");
    expect(msg).toContain("*TOTAL DOS PRODUTOS: R$ 210,00*");
    expect(msg).not.toMatch(/undefined|null|\u00a0/);
  });

  it("kit genérico lista fixo e sem aroma corretamente", () => {
    const kits = getKitDetails([createKitGroup({ productId: presente.id, units: [createUnit({ "vela:1": "Bambu" })] })], [presente]);
    const msg = buildOrderMessage(customer, [], 120, [], kits);
    expect(msg).toContain("1. Kit Presente Especial — 1 unidade");
    expect(msg).toContain("- Vela: Bambu\n- Difusor: Eucalipto\n- Sachê\n");
  });

  it("numera kits depois dos produtos comuns", () => {
    const standard = [{ line: { key: "k", productId: "p", aroma: "Lavanda", quantity: 1, customization: {} }, product: PRODUCTS[0], unitPrice: 32, subtotal: 32 }];
    const msg = buildOrderMessage(customer, standard, 242, [], getKitDetails([group]));
    expect(msg).toContain("1. Vela Aromática 100g");
    expect(msg).toContain("2. Kit Vela Dupla — 3 unidades");
  });
});
