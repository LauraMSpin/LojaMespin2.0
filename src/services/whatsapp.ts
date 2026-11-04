import { STORE_CONFIG } from "../data/settings";
import type { CartItemDetail, CustomerData, Product } from "../types";
import { customizationEntries } from "./cart";
import { formatPrice } from "../utils/format";

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Número internacional (55 + DDD + número): 10 a 15 dígitos, sem placeholder zerado. */
export function isValidWhatsAppNumber(number: string): boolean {
  const digits = onlyDigits(number);
  if (digits !== number) return false;
  if (digits.length < 10 || digits.length > 15) return false;
  return !/^\d{2}0{6,}/.test(digits);
}

export function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function isValidCep(value: string): boolean {
  return onlyDigits(value).length === 8;
}

export interface CustomerErrors {
  name?: string;
  cep?: string;
}

export function validateCustomer(customer: CustomerData): CustomerErrors {
  const errors: CustomerErrors = {};
  const words = customer.name.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.some((w) => w.length < 2)) {
    errors.name = "Informe seu nome completo.";
  }
  if (!isValidCep(customer.cep)) {
    errors.cep = "Informe um CEP válido com 8 dígitos.";
  }
  return errors;
}

const unitsText = (n: number) => `${n} ${n === 1 ? "unidade" : "unidades"}`;

interface OrderGroup {
  product: Product;
  entries: CartItemDetail[];
}

/** Agrupa linhas do mesmo produto e mesma personalização para listar os aromas juntos. */
function groupDetails(details: CartItemDetail[]): OrderGroup[] {
  const groups = new Map<string, OrderGroup>();
  for (const detail of details) {
    const custom = JSON.stringify(detail.line.customization);
    const key = `${detail.product.id}|${custom}`;
    const group = groups.get(key);
    if (group) group.entries.push(detail);
    else groups.set(key, { product: detail.product, entries: [detail] });
  }
  return [...groups.values()];
}

export function buildOrderMessage(
  customer: CustomerData,
  details: CartItemDetail[],
  total: number
): string {
  const lines: string[] = [];
  lines.push("Olá! Gostaria de realizar um pedido na Mespín! 🕯️", "");
  lines.push("*DADOS DO CLIENTE*", "");
  lines.push(`Nome: ${customer.name.trim()}`);
  lines.push(`CEP: ${formatCep(customer.cep)}`, "");
  lines.push("*MEU PEDIDO*", "");

  groupDetails(details).forEach((group, index) => {
    lines.push(`${index + 1}. ${group.product.name}`);
    for (const entry of group.entries) {
      lines.push(
        entry.line.aroma
          ? `- ${entry.line.aroma}: ${unitsText(entry.line.quantity)}`
          : `- Quantidade: ${entry.line.quantity}`
      );
    }
    const custom = customizationEntries(group.entries[0].line.customization);
    for (const c of custom) lines.push(`- ${c.label}: ${c.value}`);
    const groupTotal = group.entries.reduce((sum, e) => sum + e.subtotal, 0);
    lines.push(`Valor: ${formatPrice(groupTotal)}`, "");
  });

  lines.push("*RESUMO*", "");
  lines.push(`Subtotal: ${formatPrice(total)}`);
  lines.push(`Frete: ${STORE_CONFIG.freightLabel}`, "");
  lines.push(`*TOTAL DOS PRODUTOS: ${formatPrice(total)}*`, "");
  lines.push("Aguardo as informações para finalizar a compra. Obrigada!");
  return lines.join("\n");
}

export function buildWhatsAppUrl(number: string, message: string): string | null {
  if (!isValidWhatsAppNumber(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildConsultMessage(product: Product): string {
  return `Olá! Gostaria de saber o preço e a disponibilidade de: ${product.name}. 🕯️`;
}

export function storeWhatsAppUrl(message: string = STORE_CONFIG.defaultWhatsAppMessage): string {
  return buildWhatsAppUrl(STORE_CONFIG.whatsapp, message) ?? "#";
}
