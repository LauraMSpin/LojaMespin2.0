import { describe, expect, it } from "vitest";
import { FAQ_ITEMS, FAQ_MESPITO } from "./faq";

describe("FAQ do Mespito", () => {
  it("tem ids únicos e textos preenchidos", () => {
    const ids = FAQ_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of FAQ_ITEMS) {
      expect(item.q.trim()).not.toBe("");
      expect(item.a.trim()).not.toBe("");
    }
  });

  it("usa a frase característica e uma imagem que existe", () => {
    expect(FAQ_MESPITO.catchphrase).toBe("Oi, eu sou o Mespito! Posso ajudar?");
    const files = Object.keys(import.meta.glob("/public/assets/mespito/*"));
    expect(files).toContain("/public/assets/mespito/mespito.png");
  });
});
