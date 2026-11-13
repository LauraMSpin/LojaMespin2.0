import { ArrowLeft, MessageCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { STORE_CONFIG } from "../../data/settings";
import { useUI } from "../../context/UIContext";
import { useCart } from "../../hooks/useCart";
import { useDialogBehavior } from "../../hooks/useDialogBehavior";
import { customizationEntries } from "../../services/cart";
import { LABEL_FIELD_INFO } from "../../services/customOrders";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  formatCep,
  listGiftOptions,
  validateCustomer,
  type CustomerErrors
} from "../../services/whatsapp";
import type { CartItemDetail, CustomerData, CustomOrderDetail, KitGroupDetail } from "../../types";
import { formatCents, formatPrice } from "../../utils/format";
import ProductImage from "../ProductImage/ProductImage";
import QuantityStepper from "../QuantityStepper/QuantityStepper";
import "./CartDrawer.css";

type Step = "cart" | "identify" | "review" | "sent";

const TITLES: Record<Step, string> = {
  cart: "Seu carrinho",
  identify: "Seus dados",
  review: "Resumo do pedido",
  sent: "Pedido encaminhado"
};

function CartLineRow({ item }: { item: CartItemDetail }) {
  const { setQuantity, removeLine } = useCart();
  const { line, product, variant } = item;
  const custom = customizationEntries(line.customization);
  return (
    <li className="cart-line">
      <div className="cart-line__image">
        <ProductImage src={product.image} alt={product.name} />
      </div>
      <div className="cart-line__body">
        <div className="cart-line__head">
          <h3>{product.name}</h3>
          <button type="button" className="cart-line__remove" onClick={() => removeLine(line.key)} aria-label={`Remover ${product.name}${line.aroma ? ` (${line.aroma})` : ""}`}>
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
        {variant && <p className="cart-line__meta">Tamanho: {variant.label}</p>}
        {line.aroma && <p className="cart-line__meta">Aroma: {line.aroma}</p>}
        {custom.map((c) => (
          <p key={c.field} className="cart-line__meta">
            {c.label}: {c.value}
          </p>
        ))}
        <div className="cart-line__foot">
          <QuantityStepper
            size="sm"
            label={`${product.name}${line.aroma ? ` ${line.aroma}` : ""}`}
            min={0}
            max={STORE_CONFIG.maxQuantityPerLine}
            value={line.quantity}
            onChange={(v) => setQuantity(line.key, v)}
          />
          <div className="cart-line__prices">
            <span className="cart-line__unit">{formatPrice(item.unitPrice)} un.</span>
            <strong key={item.subtotal}>{formatPrice(item.subtotal)}</strong>
          </div>
        </div>
      </div>
    </li>
  );
}

function ReviewList({ items }: { items: CartItemDetail[] }) {
  return (
    <ul className="review-list">
      {items.map(({ line, product, variant, unitPrice, subtotal }) => {
        const custom = customizationEntries(line.customization);
        return (
          <li key={line.key}>
            <div>
              <strong>{product.name}</strong>
              <span>
                {variant ? `${variant.label} · ` : ""}
                {line.aroma ? `${line.aroma} · ` : ""}
                {line.quantity} × {formatPrice(unitPrice)}
              </span>
              {custom.map((c) => (
                <span key={c.field}>
                  {c.label}: {c.value}
                </span>
              ))}
            </div>
            <b>{formatPrice(subtotal)}</b>
          </li>
        );
      })}
    </ul>
  );
}

const unitWord = (n: number) => (n === 1 ? "unidade" : "unidades");

/** Linhas descritivas da encomenda (aromas, textos, referência), usadas no carrinho e no resumo. */
function customDescription(order: CustomOrderDetail): string[] {
  const { line, product } = order;
  const out: string[] = [];
  if (product.kind === "box") {
    for (const b of order.boxItems) {
      out.push(`${b.quantity}x ${b.name}${b.aroma ? ` (${b.aroma})` : ""}`);
    }
  } else {
    for (const u of line.units) {
      const size = product.variants?.find((v) => v.id === u.variantId)?.label;
      const name = [u.aroma, size].filter(Boolean).join(" ");
      out.push(name ? `${name}: ${u.quantity} ${unitWord(u.quantity)}` : "");
    }
  }
  for (const field of ["names", "date", "message"] as const) {
    if (line.label[field]) out.push(`${LABEL_FIELD_INFO[field].label}: ${line.label[field]}`);
  }
  if (line.packaging) out.push(`Embalagem: ${line.packaging}`);
  if (line.hasReference) out.push("Referência a enviar pelo WhatsApp");
  if (line.notes) out.push(`Observações: ${line.notes}`);
  return out.filter(Boolean);
}

function customPriceText(order: CustomOrderDetail): string {
  if (order.subtotalCents === null) return "Solicite um orçamento";
  return `${order.isFrom ? "a partir de " : ""}${formatCents(order.subtotalCents)}`;
}

function CustomLineRow({ order }: { order: CustomOrderDetail }) {
  const { removeCustom, closeCart } = useCart();
  const { openCustom } = useUI();
  const { product, line } = order;
  const qtyLabel =
    product.kind === "box"
      ? `${order.totalQuantity} ${order.totalQuantity === 1 ? "caixa" : "caixas"}`
      : `${order.totalQuantity} ${unitWord(order.totalQuantity)}`;
  return (
    <li className="cart-line">
      <div className="cart-line__image">
        <ProductImage src={product.image} alt={product.name} />
      </div>
      <div className="cart-line__body">
        <div className="cart-line__head">
          <h3>{product.name}</h3>
          <button
            type="button"
            className="cart-line__remove"
            onClick={() => removeCustom(line.key)}
            aria-label={`Remover encomenda: ${product.name}`}
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
        <p className="cart-line__type">Tipo: Produto sob encomenda</p>
        <p className="cart-line__meta">{qtyLabel}</p>
        {customDescription(order).map((text) => (
          <p key={text} className="cart-line__meta">
            {text}
          </p>
        ))}
        {order.discountPercent > 0 && order.finalUnitCents !== null && (
          <p className="cart-line__meta">
            Desconto de {order.discountPercent}% · {formatCents(order.finalUnitCents)} por unidade
          </p>
        )}
        {order.pendingItems.length > 0 && (
          <p className="cart-line__meta">Itens com valor a combinar: {order.pendingItems.join(", ")}</p>
        )}
        <div className="cart-line__foot">
          <button
            type="button"
            className="cart-line__edit"
            onClick={() => {
              closeCart();
              openCustom(product, line);
            }}
          >
            <Pencil size={14} aria-hidden="true" /> Editar
          </button>
          <div className="cart-line__prices">
            <span className="cart-line__unit">valor estimado</span>
            <strong>{customPriceText(order)}</strong>
          </div>
        </div>
      </div>
    </li>
  );
}

function CustomReviewList({ orders }: { orders: CustomOrderDetail[] }) {
  return (
    <ul className="review-list">
      {orders.map((order) => (
        <li key={order.line.key}>
          <div>
            <strong>{order.product.name}</strong>
            <span>
              {order.totalQuantity} {order.product.kind === "box" ? (order.totalQuantity === 1 ? "caixa" : "caixas") : unitWord(order.totalQuantity)}
            </span>
            {customDescription(order).map((text) => (
              <span key={text}>{text}</span>
            ))}
          </div>
          <b>{customPriceText(order)}</b>
        </li>
      ))}
    </ul>
  );
}

function KitGroupRow({ detail }: { detail: KitGroupDetail }) {
  const { removeKitUnit, removeKitGroup, closeCart } = useCart();
  const { openKitEdit } = useUI();
  const { group, product } = detail;
  const count = detail.units.length;
  const atLimit = group.units.length >= STORE_CONFIG.maxKitUnits;

  const edit = (state: { focusUnitId?: string; addUnit?: boolean }) => {
    closeCart();
    openKitEdit(product, { group, ...state });
  };

  return (
    <li className="cart-line cart-line--kit">
      <div className="cart-line__image">
        <ProductImage src={product.image} alt={product.name} />
      </div>
      <div className="cart-line__body">
        <div className="cart-line__head">
          <h3>
            {product.name} — {count} {count === 1 ? "unidade" : "unidades"}
          </h3>
          <button
            type="button"
            className="cart-line__remove"
            onClick={() => removeKitGroup(group.key)}
            aria-label={`Remover ${product.name} inteiro (${count} ${count === 1 ? "unidade" : "unidades"})`}
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>

        <ul className="kit-units">
          {detail.units.map((u) => (
            <li key={u.unit.id} className="kit-unit">
              <div className="kit-unit__head">
                <strong>{u.label}</strong>
                <span>
                  <button
                    type="button"
                    className="kit-unit__btn"
                    onClick={() => edit({ focusUnitId: u.unit.id })}
                    aria-label={`Editar ${u.label} de ${product.name}`}
                  >
                    <Pencil size={13} aria-hidden="true" /> Editar
                  </button>
                  <button
                    type="button"
                    className="kit-unit__btn"
                    onClick={() => removeKitUnit(group.key, u.unit.id)}
                    aria-label={`Remover ${u.label} de ${product.name}`}
                  >
                    <Trash2 size={13} aria-hidden="true" /> Remover
                  </button>
                </span>
              </div>
              <ul>
                {u.items.map((item) => (
                  <li key={item.name} className="cart-line__meta">
                    {item.value ? `${item.name}: ${item.value}` : item.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="cart-line__foot">
          <button
            type="button"
            className="cart-line__edit"
            onClick={() => edit({ addUnit: true })}
            disabled={atLimit}
            title={atLimit ? `Máximo de ${STORE_CONFIG.maxKitUnits} kits por compra` : undefined}
          >
            <Plus size={14} aria-hidden="true" /> Adicionar unidade
          </button>
          <div className="cart-line__prices">
            <span className="cart-line__unit">{formatPrice(detail.unitPrice)} cada</span>
            <strong>{formatPrice(detail.subtotal)}</strong>
          </div>
        </div>
      </div>
    </li>
  );
}

function KitReviewList({ kits }: { kits: KitGroupDetail[] }) {
  return (
    <ul className="review-list">
      {kits.map(({ group, product, units, unitPrice, subtotal }) => (
        <li key={group.key}>
          <div>
            <strong>
              {product.name} — {units.length} {units.length === 1 ? "unidade" : "unidades"}
            </strong>
            {units.map((u) => (
              <span key={u.unit.id}>
                {u.label}: {u.items.map((i) => (i.value ? `${i.name} ${i.value}` : i.name)).join(" · ")}
              </span>
            ))}
            <span>{formatPrice(unitPrice)} por kit</span>
          </div>
          <b>{formatPrice(subtotal)}</b>
        </li>
      ))}
    </ul>
  );
}

function CartTotals({ review = false }: { review?: boolean }) {
  const { items, kitItems, total, count, customItems, customTotalCents, customHasPending } = useCart();
  const hasCustom = customItems.length > 0;
  const hasStandard = items.length > 0 || kitItems.length > 0;
  const standardCount = count - customItems.length;
  const grandCents = Math.round(total * 100) + customTotalCents;
  const prefix = customHasPending ? "a partir de " : "";
  return (
    <>
      {hasStandard && (
        <div className="cart-sum">
          <span>{review ? "Total dos produtos" : `Subtotal (${standardCount} ${standardCount === 1 ? "item" : "itens"})`}</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      )}
      {hasCustom && (
        <div className="cart-sum">
          <span>Personalizados (estimativa)</span>
          <strong>
            {prefix}
            {formatCents(customTotalCents)}
          </strong>
        </div>
      )}
      <div className="cart-sum cart-sum--muted">
        <span>Frete</span>
        <span>{STORE_CONFIG.freightLabel}</span>
      </div>
      {hasCustom && (
        <div className="cart-sum">
          <span>Total estimado</span>
          <strong>
            {prefix}
            {formatCents(grandCents)}
          </strong>
        </div>
      )}
    </>
  );
}

export default function CartDrawer() {
  const { isOpen, closeCart, items, kitItems, customItems, isEmpty, total, clearCart } = useCart();
  const panelRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState<Step>("cart");
  const [customer, setCustomer] = useState<CustomerData>({ name: "", cep: "" });
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [sendError, setSendError] = useState<string | null>(null);
  const [isGift, setIsGift] = useState(false);
  const [giftKeys, setGiftKeys] = useState<string[]>([]);
  const [giftError, setGiftError] = useState(false);

  useDialogBehavior(panelRef, isOpen, closeCart);

  useEffect(() => {
    if (!isOpen) {
      setStep("cart");
      setSendError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEmpty && (step === "identify" || step === "review")) setStep("cart");
  }, [isEmpty, step]);

  const giftOptions = useMemo(() => listGiftOptions(items, kitItems, customItems), [items, kitItems, customItems]);
  // Só vale o que ainda está no carrinho (itens removidos saem da seleção).
  const activeGiftKeys = useMemo(
    () => (isGift ? giftOptions.filter((o) => giftKeys.includes(o.key)).map((o) => o.key) : []),
    [isGift, giftOptions, giftKeys]
  );

  const message = useMemo(
    () => (isEmpty ? "" : buildOrderMessage(customer, items, total, customItems, kitItems, activeGiftKeys)),
    [customer, items, total, customItems, kitItems, isEmpty, activeGiftKeys]
  );

  const toggleGift = (on: boolean) => {
    setIsGift(on);
    setGiftError(false);
    if (on && activeGiftKeys.length === 0) setGiftKeys(giftOptions.map((o) => o.key));
  };

  const toggleGiftItem = (key: string, on: boolean) => {
    setGiftError(false);
    setGiftKeys((keys) => (on ? [...keys.filter((k) => k !== key), key] : keys.filter((k) => k !== key)));
  };
  const whatsappUrl = useMemo(() => buildWhatsAppUrl(STORE_CONFIG.whatsapp, message), [message]);

  const submitIdentify = (event: FormEvent) => {
    event.preventDefault();
    const found = validateCustomer(customer);
    setErrors(found);
    const missingGift = isGift && activeGiftKeys.length === 0;
    setGiftError(missingGift);
    if (Object.keys(found).length === 0 && !missingGift) setStep("review");
  };

  const sendToWhatsApp = () => {
    if (!whatsappUrl) {
      setSendError("O número de WhatsApp da loja não está configurado corretamente.");
      return;
    }
    setSendError(null);
    const anchor = document.createElement("a");
    anchor.href = whatsappUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setStep("sent");
  };

  const finishAndClear = () => {
    clearCart();
    setIsGift(false);
    setGiftKeys([]);
    setStep("cart");
    closeCart();
  };

  return (
    <div className={`cart-overlay ${isOpen ? "is-open" : ""}`} onMouseDown={(e) => e.target === e.currentTarget && closeCart()}>
      <aside
        ref={panelRef}
        className="cart-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
      >
        <header className="cart-panel__header">
          {step === "identify" || step === "review" ? (
            <button type="button" className="cart-panel__back" onClick={() => setStep(step === "review" ? "identify" : "cart")} aria-label="Voltar">
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
          ) : null}
          <h2 id="cart-title">{TITLES[step]}</h2>
          <button type="button" className="cart-panel__close" onClick={closeCart} aria-label="Fechar carrinho">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        {step === "cart" && (
          <>
            {isEmpty ? (
              <div className="cart-empty">
                <p>Seu carrinho está vazio.</p>
                <Link to="/catalogo" className="btn btn--primary" onClick={closeCart}>
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <>
                <ul className="cart-panel__list">
                  {items.map((item) => (
                    <CartLineRow key={item.line.key} item={item} />
                  ))}
                  {kitItems.map((detail) => (
                    <KitGroupRow key={detail.group.key} detail={detail} />
                  ))}
                  {customItems.map((order) => (
                    <CustomLineRow key={order.line.key} order={order} />
                  ))}
                </ul>
                <footer className="cart-panel__footer">
                  <CartTotals />
                  <button type="button" className="btn btn--primary" onClick={() => setStep("identify")}>
                    Finalizar pedido
                  </button>
                  <div className="cart-panel__links">
                    <Link to="/catalogo" onClick={closeCart}>
                      Voltar ao catálogo
                    </Link>
                    <button type="button" onClick={clearCart}>
                      Limpar carrinho
                    </button>
                  </div>
                </footer>
              </>
            )}
          </>
        )}

        {step === "identify" && (
          <form className="cart-form" onSubmit={submitIdentify} noValidate>
            <p className="cart-form__intro">
              Informe seus dados para identificarmos o pedido. O endereço completo combinamos pelo WhatsApp.
            </p>
            <label>
              <span>Nome completo</span>
              <input
                type="text"
                autoComplete="name"
                value={customer.name}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "err-name" : undefined}
                maxLength={100}
              />
              {errors.name && (
                <em id="err-name" role="alert">
                  {errors.name}
                </em>
              )}
            </label>
            <label>
              <span>CEP de entrega</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                value={customer.cep}
                onChange={(e) => setCustomer((c) => ({ ...c, cep: formatCep(e.target.value) }))}
                aria-invalid={Boolean(errors.cep)}
                aria-describedby={errors.cep ? "err-cep" : undefined}
                maxLength={9}
              />
              {errors.cep && (
                <em id="err-cep" role="alert">
                  {errors.cep}
                </em>
              )}
            </label>
            <fieldset className="cart-gift">
              <legend>O pedido é para presente?</legend>
              <div className="cart-gift__choice">
                <label>
                  <input type="radio" name="gift" checked={!isGift} onChange={() => toggleGift(false)} /> Não
                </label>
                <label>
                  <input type="radio" name="gift" checked={isGift} onChange={() => toggleGift(true)} /> Sim, é presente
                </label>
              </div>
              {isGift && (
                <>
                  <p className="cart-form__note">Quais itens serão presente?</p>
                  <ul className="cart-gift__items">
                    {giftOptions.map((option) => (
                      <li key={option.key}>
                        <label>
                          <input
                            type="checkbox"
                            checked={activeGiftKeys.includes(option.key)}
                            onChange={(e) => toggleGiftItem(option.key, e.target.checked)}
                          />
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                  {giftError && (
                    <em role="alert">Marque ao menos um item que será presente ou escolha &quot;Não&quot;.</em>
                  )}
                </>
              )}
            </fieldset>
            <p className="cart-form__note">Não pedimos dados de pagamento nem documentos.</p>
            <div className="cart-form__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setStep("cart")}>
                Voltar ao carrinho
              </button>
              <button type="submit" className="btn btn--primary">
                Revisar pedido
              </button>
            </div>
          </form>
        )}

        {step === "review" && (
          <>
            <div className="cart-panel__list cart-review">
              <section>
                <h3>Cliente</h3>
                <p>{customer.name.trim()}</p>
                <p>CEP {formatCep(customer.cep)}</p>
              </section>
              {activeGiftKeys.length > 0 && (
                <section>
                  <h3>Para presente 🎁</h3>
                  <ul className="review-gift">
                    {giftOptions
                      .filter((o) => activeGiftKeys.includes(o.key))
                      .map((o) => (
                        <li key={o.key}>{o.label}</li>
                      ))}
                  </ul>
                </section>
              )}
              {(items.length > 0 || kitItems.length > 0) && (
                <section>
                  <h3>Produtos</h3>
                  {items.length > 0 && <ReviewList items={items} />}
                  {kitItems.length > 0 && <KitReviewList kits={kitItems} />}
                </section>
              )}
              {customItems.length > 0 && (
                <section>
                  <h3>Encomendas personalizadas</h3>
                  <CustomReviewList orders={customItems} />
                </section>
              )}
              <p className="cart-review__note">
                Esta é uma solicitação de {customItems.length > 0 ? "pedido e orçamento" : "pedido"}. Frete, disponibilidade final, arte, prazo e pagamento serão confirmados no atendimento pelo WhatsApp.
              </p>
            </div>
            <footer className="cart-panel__footer">
              <CartTotals review />
              {sendError && <p className="cart-form__error" role="alert">{sendError}</p>}
              <button type="button" className="btn btn--whatsapp" onClick={sendToWhatsApp}>
                <MessageCircle size={18} aria-hidden="true" /> Enviar pedido pelo WhatsApp
              </button>
              <div className="cart-panel__links">
                <button type="button" onClick={() => setStep("cart")}>
                  Voltar ao carrinho
                </button>
                <button type="button" onClick={() => setStep("identify")}>
                  Editar dados
                </button>
              </div>
            </footer>
          </>
        )}

        {step === "sent" && (
          <div className="cart-sent">
            <p>
              Abrimos o WhatsApp com a mensagem do seu pedido. Confira e envie para a Mespín.
            </p>
            {whatsappUrl && (
              <a className="btn btn--whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden="true" /> Abrir WhatsApp novamente
              </a>
            )}
            <p className="cart-sent__note">
              Seu carrinho foi mantido, pois não conseguimos confirmar o envio. Depois de enviar a mensagem, você pode limpá-lo.
            </p>
            <button type="button" className="btn btn--ghost" onClick={finishAndClear}>
              Já enviei — limpar carrinho
            </button>
            <button type="button" className="cart-sent__keep" onClick={() => setStep("cart")}>
              Voltar ao carrinho
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
