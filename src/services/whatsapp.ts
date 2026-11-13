import { STORE_CONFIG } from "../data/settings";
import type { CartItemDetail, CustomerData, CustomOrderDetail, KitGroupDetail, Product, ProductVariant } from "../types";
import { customizationEntries } from "./cart";
import { customHasPending, customTotalCents, LABEL_FIELD_INFO, toCents } from "./customOrders";
import { formatCents, formatPrice } from "../utils/format";

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
  key: string;
  product: Product;
  variant?: ProductVariant;
  entries: CartItemDetail[];
}

/** Agrupa linhas do mesmo produto e mesma personalização para listar os aromas juntos. */
function groupDetails(details: CartItemDetail[]): OrderGroup[] {
  const groups = new Map<string, OrderGroup>();
  for (const detail of details) {
    const custom = JSON.stringify(detail.line.customization);
    const key = `${detail.product.id}|${detail.variant?.id ?? ""}|${custom}`;
    const group = groups.get(key);
    if (group) group.entries.push(detail);
    else groups.set(key, { key, product: detail.product, variant: detail.variant, entries: [detail] });
  }
  return [...groups.values()];
}

export interface GiftOption {
  /** "p:" produto agrupado, "k:" kit, "c:" personalizado. */
  key: string;
  label: string;
}

/** Itens do carrinho que o cliente pode marcar como presente (agrupados como no pedido enviado). */
export function listGiftOptions(
  details: CartItemDetail[],
  kitGroups: KitGroupDetail[] = [],
  customOrders: CustomOrderDetail[] = []
): GiftOption[] {
  return [
    ...groupDetails(details).map((g) => ({
      key: `p:${g.key}`,
      label: `${g.product.name}${g.variant ? ` (${g.variant.label})` : ""}`
    })),
    ...kitGroups.map((k) => ({
      key: `k:${k.group.key}`,
      label: `${k.product.name} — ${k.units.length} ${k.units.length === 1 ? "unidade" : "unidades"}`
    })),
    ...customOrders.map((o) => ({ key: `c:${o.line.key}`, label: o.product.name }))
  ];
}

export function buildOrderMessage(
  customer: CustomerData,
  details: CartItemDetail[],
  total: number,
  customOrders: CustomOrderDetail[] = [],
  kitGroups: KitGroupDetail[] = [],
  giftKeys: string[] = []
): string {
  const gifts = new Set(giftKeys);
  const giftItems = listGiftOptions(details, kitGroups, customOrders).filter((o) => gifts.has(o.key));
  const GIFT = " 🎁";
  const hasStandard = details.length > 0 || kitGroups.length > 0;
  const hasCustom = customOrders.length > 0;
  const lines: string[] = [];

  if (hasCustom && hasStandard) {
    lines.push("Olá! Gostaria de realizar um pedido e solicitar orçamento de produtos personalizados na Mespín! 🕯️", "");
  } else if (hasCustom) {
    lines.push("Olá! Gostaria de solicitar um orçamento de produtos personalizados da Mespín! 🕯️", "");
  } else {
    lines.push("Olá! Gostaria de realizar um pedido na Mespín! 🕯️", "");
  }
  lines.push("*DADOS DO CLIENTE*", "");
  lines.push(`Nome: ${customer.name.trim()}`);
  lines.push(`CEP: ${formatCep(customer.cep)}`, "");
  if (giftItems.length > 0) {
    lines.push("*PEDIDO PARA PRESENTE* 🎁", "");
    for (const item of giftItems) lines.push(`- ${item.label}`);
    lines.push("");
  }

  if (hasStandard) {
    lines.push("*MEU PEDIDO*", "");
    const standardGroups = groupDetails(details);
    standardGroups.forEach((group, index) => {
      lines.push(`${index + 1}. ${group.product.name}${group.variant ? ` (${group.variant.label})` : ""}${gifts.has(`p:${group.key}`) ? GIFT : ""}`);
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
    kitGroups.forEach((kit, index) =>
      lines.push(...kitGroupLines(kit, standardGroups.length + index + 1, gifts.has(`k:${kit.group.key}`)), "")
    );
  }

  if (hasCustom) {
    lines.push("*PRODUTOS PERSONALIZADOS*", "");
    customOrders.forEach((order, index) =>
      lines.push(...customOrderLines(order, index + 1, gifts.has(`c:${order.line.key}`)), "")
    );
  }

  lines.push("*RESUMO*", "");
  if (!hasCustom) {
    lines.push(`Subtotal: ${formatPrice(total)}`);
    lines.push(`Frete: ${STORE_CONFIG.freightLabel}`, "");
    lines.push(`*TOTAL DOS PRODUTOS: ${formatPrice(total)}*`, "");
    lines.push("Aguardo as informações para finalizar a compra. Obrigada!");
    return lines.join("\n");
  }

  const customCents = customTotalCents(customOrders);
  const estimate = customHasPending(customOrders);
  if (hasStandard) lines.push(`Subtotal dos produtos: ${formatPrice(total)}`);
  lines.push(
    `Subtotal estimado dos personalizados: ${estimate ? "a partir de " : ""}${formatCents(customCents)}`
  );
  lines.push(`Frete: ${STORE_CONFIG.freightLabel}`, "");
  const grand = toCents(total) + customCents;
  lines.push(`*TOTAL ESTIMADO: ${estimate ? "a partir de " : ""}${formatCents(grand)}*`, "");
  lines.push("Gostaria de receber informações sobre prazo de produção, frete e aprovação da arte.");
  lines.push("Obrigada!");
  return lines.join("\n");
}

/** Cada kit é descrito unidade por unidade, com os itens e aromas de cada uma. */
function kitGroupLines(kit: KitGroupDetail, index: number, gift = false): string[] {
  const count = kit.units.length;
  const out: string[] = [
    `${index}. ${kit.product.name} — ${count} ${count === 1 ? "unidade" : "unidades"}${gift ? " 🎁" : ""}`,
    ""
  ];
  for (const unit of kit.units) {
    out.push(`*${unit.label}*`);
    for (const item of unit.items) out.push(item.value ? `- ${item.name}: ${item.value}` : `- ${item.name}`);
    out.push("");
  }
  out.push(`Valor unitário do kit: ${formatPrice(kit.unitPrice)}`);
  out.push(`Valor: ${formatPrice(kit.subtotal)}`);
  return out;
}

function customOrderLines(order: CustomOrderDetail, index: number, gift = false): string[] {
  const { product, line } = order;
  const out: string[] = [`${index}. ${product.name}${gift ? " 🎁" : ""}`];

  if (product.kind === "box") {
    out.push(`- Quantidade de caixas: ${line.units[0]?.quantity ?? 0}`);
    out.push("- Itens da caixa:");
    for (const item of order.boxItems) {
      const aroma = item.aroma ? ` (${item.aroma})` : "";
      const price = item.priceCents === null ? "valor a combinar" : formatCents(item.priceCents * item.quantity);
      out.push(`  • ${item.quantity}x ${item.name}${aroma} — ${price}`);
    }
  } else {
    for (const unit of line.units) {
      const size = product.variants?.find((v) => v.id === unit.variantId)?.label;
      const name = [unit.aroma, size].filter(Boolean).join(" ");
      out.push(name ? `- ${name}: ${unitsText(unit.quantity)}` : `- Quantidade: ${unit.quantity}`);
    }
    if (line.units.length > 1) out.push(`- Quantidade total: ${unitsText(order.totalQuantity)}`);
  }

  for (const field of ["names", "date", "message"] as const) {
    const value = line.label[field];
    if (value) out.push(`- ${LABEL_FIELD_INFO[field].label}: ${value}`);
  }
  if (line.packaging) out.push(`- Embalagem: ${line.packaging}`);
  if (line.hasReference) out.push("- Tenho uma imagem ou referência para enviar pelo WhatsApp.");
  if (line.notes) out.push(`- Observações: ${line.notes}`);

  if (order.unitCents === null) {
    out.push("Valor: solicitar orçamento");
    return out;
  }
  const prefix = order.isFrom ? "a partir de " : "";
  out.push(`Preço ${product.kind === "box" ? "da caixa" : "unitário"}: ${prefix}${formatCents(order.unitCents)}`);
  if (order.discountPercent > 0 && order.finalUnitCents !== null) {
    out.push(`Desconto: ${order.discountPercent}%`);
    out.push(`Preço unitário com desconto: ${formatCents(order.finalUnitCents)}`);
  }
  if (order.pendingItems.length > 0) {
    out.push(`Itens com valor a combinar: ${order.pendingItems.join(", ")}`);
  }
  out.push(`Subtotal estimado: ${prefix}${formatCents(order.subtotalCents ?? 0)}`);
  return out;
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
