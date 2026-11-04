import { STORE_CONFIG } from "../data/settings";

const currencyFormatter = new Intl.NumberFormat(STORE_CONFIG.locale, {
  style: "currency",
  currency: STORE_CONFIG.currency
});

/** Formata em reais, com espaço comum (sem NBSP) para funcionar bem em mensagens. */
export function formatPrice(value: number): string {
  return currencyFormatter.format(value).replace(/\u00a0/g, " ");
}

/** Caminho de arquivo de `public/` respeitando o `base` do Vite (GitHub Pages). */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
