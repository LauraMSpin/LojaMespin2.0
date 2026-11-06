import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS, filterProducts } from "./catalog";
import { PRODUCTS as REAL_PRODUCTS } from "../data/products";
import { getCategory } from "../data/categories";
import type { Product } from "../types";

const base = { description: "", image: "", aromas: [], available: true, featured: false, isChristmas: false };

// Catálogo fixo de teste: independe das edições feitas em src/data/products.ts
const PRODUCTS: Product[] = [
  ...REAL_PRODUCTS.slice(0, 3),
  { ...base, id: "difusor-a", name: "Difusor A", category: "difusores", price: 149.9, sortOrder: 90 },
  { ...base, id: "difusor-b", name: "Difusor B", category: "difusores", price: 45, sortOrder: 91 },
  { ...base, id: "aromatizador-spray-citrico", name: "Aromatizador Spray Cítrico", category: "saches", price: 40, sortOrder: 92 },
  { ...base, id: "sob-consulta", name: "Item sob consulta", category: "velas", price: null, sortOrder: 93 }
];

const run = (over: Partial<typeof DEFAULT_FILTERS>) =>
  filterProducts(PRODUCTS, { ...DEFAULT_FILTERS, ...over }, (id) => getCategory(id)?.name ?? "");

describe("filterProducts", () => {
  it("busca por nome sem considerar acentos", () => {
    expect(run({ query: "citrico" }).map((p) => p.id)).toEqual(["aromatizador-spray-citrico"]);
  });

  it("busca por aroma e por categoria", () => {
    expect(run({ query: "lavanda" }).map((p) => p.id)).toContain("vela-aromatica-100g");
    expect(run({ query: "difusores" })).toHaveLength(2);
  });

  it("retorna vazio quando nada corresponde", () => {
    expect(run({ query: "zzzz" })).toEqual([]);
  });

  it("filtra por categoria, natal e combina filtros", () => {
    expect(run({ category: "natal" }).every((p) => p.isChristmas)).toBe(true);
    const velas = run({ category: "velas", onlyChristmas: true });
    expect(velas.every((p) => p.category === "velas" && p.isChristmas)).toBe(true);
  });

  it("filtra por faixa de preço excluindo preço sob consulta", () => {
    const list = run({ minPrice: 30, maxPrice: 80 });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.price !== null && p.price >= 30 && p.price <= 80)).toBe(true);
  });

  it("ordena por preço e nome", () => {
    const asc = run({ sort: "price-asc" }).map((p) => p.price);
    const priced = asc.filter((p): p is number => p !== null);
    expect(priced).toEqual([...priced].sort((a, b) => a - b));
    expect(asc[asc.length - 1]).toBeNull();
    const desc = run({ sort: "price-desc" });
    expect(desc[0].price).toBe(149.9);
    const names = run({ sort: "name" }).map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "pt-BR")));
  });
});
