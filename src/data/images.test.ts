import { describe, expect, it } from "vitest";
import { CUSTOM_PRODUCTS } from "./customProducts";
import { PRODUCTS } from "./products";

// Lista (sem carregar) os arquivos existentes em public/assets.
const existing = new Set(Object.keys(import.meta.glob("/public/assets/**/*")));

const entries = [
  ...PRODUCTS.map((p) => ({ id: p.id, image: p.image, gallery: p.gallery })),
  ...CUSTOM_PRODUCTS.map((p) => ({ id: p.id, image: p.image, gallery: p.gallery }))
];

describe("fotos dos produtos", () => {
  // Só a galeria é exigida: a foto principal pode faltar (o site mostra o placeholder da marca).
  it("todo caminho de gallery existe em public/", () => {
    const missing = entries.flatMap((e) =>
      (e.gallery ?? []).filter((src) => !existing.has(`/public/${src}`)).map((src) => `${e.id}: ${src}`)
    );
    expect(missing).toEqual([]);
  });

  it("gallery não repete a foto principal nem tem duplicatas", () => {
    const bad = entries.filter((e) => {
      const g = e.gallery ?? [];
      return new Set(g).size !== g.length || (e.image ? g.includes(e.image) : false);
    });
    expect(bad.map((e) => e.id)).toEqual([]);
  });
});
