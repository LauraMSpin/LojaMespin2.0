import { ShoppingCart, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CUSTOM_RULES } from "../../data/customProducts";
import { useUI } from "../../context/UIContext";
import { useCart } from "../../hooks/useCart";
import { useDialogBehavior } from "../../hooks/useDialogBehavior";
import {
  LABEL_FIELD_INFO,
  TEXT_LIMITS,
  activeTier,
  computeCustomOrder,
  createCustomLine,
  getBoxSources,
  validateCustomLine
} from "../../services/customOrders";
import type { BoxItem, CustomLabel, CustomLabelField, CustomProduct, CustomLine } from "../../types";
import { formatCents } from "../../utils/format";
import ProductImage from "../ProductImage/ProductImage";
import QuantityStepper from "../QuantityStepper/QuantityStepper";
import { minimumText } from "../CustomProductCard/CustomProductCard";
import "../ProductModal/ProductModal.css";
import "./CustomProductModal.css";

const unitWord = (n: number) => (n === 1 ? "unidade" : "unidades");

function Counter({ value, max }: { value: string; max: number }) {
  const left = max - value.length;
  return (
    <small className="cmodal__counter" aria-live="off">
      {left} {left === 1 ? "caractere restante" : "caracteres restantes"}
    </small>
  );
}

function CustomDialog({
  product,
  editLine,
  onClose
}: {
  product: CustomProduct;
  editLine?: CustomLine;
  onClose: () => void;
}) {
  const { addCustom, replaceCustom } = useCart();
  const { showToast } = useUI();
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehavior(panelRef, true, onClose);

  const max = CUSTOM_RULES.maxQuantity;
  const min = product.minimumQuantity;
  const isBox = product.kind === "box";
  const aromas = product.options.aromas;
  const hasAromas = aromas.length > 0;
  const perAroma = product.minimumScope === "perAroma";
  const sources = useMemo(() => (isBox ? getBoxSources() : []), [isBox]);
  const images = useMemo(
    () => [product.image, ...(product.gallery ?? [])].filter((i): i is string => Boolean(i)),
    [product]
  );
  const [imageIndex, setImageIndex] = useState(0);

  const [aromaQty, setAromaQty] = useState<Record<string, number>>(() => {
    const result: Record<string, number> = {};
    for (const u of editLine?.units ?? []) if (u.aroma) result[u.aroma] = u.quantity;
    return result;
  });
  const [singleQty, setSingleQty] = useState(
    () => editLine?.units.reduce((sum, u) => sum + u.quantity, 0) ?? min
  );
  const [label, setLabel] = useState<CustomLabel>(editLine?.label ?? {});
  const [packaging, setPackaging] = useState(editLine?.packaging ?? "");
  const [hasReference, setHasReference] = useState(editLine?.hasReference ?? false);
  const [notes, setNotes] = useState(editLine?.notes ?? "");
  const [boxSel, setBoxSel] = useState<Record<string, { aroma: string | null; quantity: number }>>(() => {
    const result: Record<string, { aroma: string | null; quantity: number }> = {};
    for (const b of editLine?.boxItems ?? []) result[`${b.source}:${b.refId}`] = { aroma: b.aroma, quantity: b.quantity };
    return result;
  });

  const draft = useMemo(() => {
    const units =
      hasAromas && !isBox
        ? aromas.filter((a) => (aromaQty[a] ?? 0) > 0).map((a) => ({ aroma: a, quantity: aromaQty[a] }))
        : [{ aroma: null, quantity: singleQty }];
    const boxItems: BoxItem[] = isBox
      ? sources
          .filter((s) => (boxSel[`${s.source}:${s.refId}`]?.quantity ?? 0) > 0)
          .map((s) => {
            const sel = boxSel[`${s.source}:${s.refId}`];
            return { source: s.source, refId: s.refId, aroma: sel.aroma, quantity: sel.quantity };
          })
      : [];
    return createCustomLine({
      key: editLine?.key,
      productId: product.id,
      units,
      label,
      packaging,
      hasReference,
      notes,
      boxItems
    });
  }, [aromaQty, singleQty, label, packaging, hasReference, notes, boxSel, sources, aromas, hasAromas, isBox, product.id, editLine?.key]);

  const detail = useMemo(() => computeCustomOrder(draft, product, sources), [draft, product, sources]);
  const errors = useMemo(() => validateCustomLine(draft, product), [draft, product]);
  const tier = activeTier(product, detail.totalQuantity);
  const unavailable = !product.available;
  const canAdd = !unavailable && errors.length === 0;

  const handleAdd = () => {
    if (!canAdd) return;
    if (editLine) {
      replaceCustom(editLine.key, draft);
      showToast("Encomenda atualizada");
    } else {
      addCustom(draft);
      showToast(`${product.name} adicionado à encomenda`);
    }
    onClose();
  };

  const setLabelField = (field: CustomLabelField, value: string) => setLabel((l) => ({ ...l, [field]: value }));
  const prefix = detail.isFrom ? "a partir de " : "";

  return (
    <div className="pmodal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className="pmodal__panel cmodal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmodal-title"
        tabIndex={-1}
      >
        <button type="button" className="pmodal__close" onClick={onClose} aria-label="Fechar">
          <X size={22} aria-hidden="true" />
        </button>

        <div className="pmodal__media">
          <div className="pmodal__image">
            <ProductImage src={images[imageIndex]} alt={product.name} fit="contain" loading="eager" />
          </div>
          {images.length > 1 && (
            <div className="pmodal__thumbs">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={i === imageIndex ? "is-active" : ""}
                  onClick={() => setImageIndex(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                >
                  <ProductImage src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pmodal__info cmodal__info">
          <span className="pmodal__category">Sob encomenda</span>
          <h2 id="cmodal-title" className="pmodal__title">
            {product.name}
          </h2>
          <p className="pmodal__description">{product.description}</p>

          <div className="pmodal__price">
            {product.basePrice === null ? (
              <span className="pmodal__price-consult">Solicite um orçamento</span>
            ) : (
              <strong>
                {product.priceFrom ? "A partir de " : ""}
                {formatCents(Math.round(product.basePrice * 100))}
                {!isBox && <small> / unidade</small>}
              </strong>
            )}
          </div>

          <ul className="cmodal__facts">
            <li>
              <strong>{minimumText(product)}</strong>
            </li>
            <li>
              {product.productionTime
                ? `Prazo estimado de produção: ${product.productionTime}.`
                : "Prazo de produção a confirmar pelo atendimento."}
            </li>
            <li>A produção só começa após a confirmação das condições e das aprovações necessárias.</li>
          </ul>

          {product.discountTiers.length > 0 && (
            <div className="cmodal__tiers">
              <h3>Descontos por quantidade</h3>
              <ul>
                <li className={!tier ? "is-active" : ""}>
                  <span>
                    {min} {unitWord(min)}
                  </span>
                  <span>preço padrão</span>
                </li>
                {[...product.discountTiers]
                  .sort((a, b) => a.minQuantity - b.minQuantity)
                  .map((t) => (
                    <li key={t.minQuantity} className={tier?.minQuantity === t.minQuantity ? "is-active" : ""}>
                      <span>
                        {t.minQuantity} {unitWord(t.minQuantity)} ou mais
                      </span>
                      <span>{t.discount}% de desconto</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {unavailable ? (
            <p className="pmodal__notice">Produto indisponível para encomenda no momento.</p>
          ) : (
            <>
              {isBox ? (
                <>
                  <div className="pmodal__qty">
                    <span>Quantidade de caixas</span>
                    <QuantityStepper
                      label="Quantidade de caixas"
                      min={min}
                      max={max}
                      step={product.quantityStep}
                      value={singleQty}
                      editable
                      onChange={setSingleQty}
                    />
                  </div>
                  <fieldset className="pmodal__aromas">
                    <legend>Itens da caixa (por caixa)</legend>
                    <ul>
                      {sources.map((s) => {
                        const key = `${s.source}:${s.refId}`;
                        const sel = boxSel[key] ?? { aroma: null, quantity: 0 };
                        return (
                          <li key={key} className={sel.quantity > 0 ? "is-selected" : ""}>
                            <span className="cmodal__item-name">
                              {s.name}
                              <small>{s.priceCents === null ? "valor a combinar" : formatCents(s.priceCents)}</small>
                            </span>
                            {s.aromas.length > 0 && sel.quantity > 0 && (
                              <select
                                aria-label={`Aroma de ${s.name}`}
                                value={sel.aroma ?? ""}
                                onChange={(e) =>
                                  setBoxSel((b) => ({ ...b, [key]: { ...sel, aroma: e.target.value || null } }))
                                }
                              >
                                <option value="">Aroma a combinar</option>
                                {s.aromas.map((a) => (
                                  <option key={a} value={a}>
                                    {a}
                                  </option>
                                ))}
                              </select>
                            )}
                            <QuantityStepper
                              size="sm"
                              label={s.name}
                              max={99}
                              value={sel.quantity}
                              onChange={(v) => setBoxSel((b) => ({ ...b, [key]: { ...sel, quantity: v } }))}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </fieldset>
                </>
              ) : hasAromas ? (
                <fieldset className="pmodal__aromas">
                  <legend>Escolha os aromas e quantidades</legend>
                  <ul>
                    {aromas.map((aroma) => (
                      <li key={aroma} className={(aromaQty[aroma] ?? 0) > 0 ? "is-selected" : ""}>
                        <span>{aroma}</span>
                        <QuantityStepper
                          size="sm"
                          label={aroma}
                          max={max}
                          step={product.quantityStep}
                          floor={perAroma ? min : 0}
                          value={aromaQty[aroma] ?? 0}
                          editable
                          onChange={(v) => setAromaQty((q) => ({ ...q, [aroma]: v }))}
                        />
                      </li>
                    ))}
                  </ul>
                </fieldset>
              ) : (
                <div className="pmodal__qty">
                  <span>Quantidade</span>
                  <QuantityStepper
                    label="Quantidade"
                    min={min}
                    max={max}
                    step={product.quantityStep}
                    value={singleQty}
                    editable
                    onChange={setSingleQty}
                  />
                </div>
              )}

              {(product.options.labelFields.length > 0 || product.options.packaging) && (
                <div className="pmodal__custom">
                  {product.options.labelFields.map((field) => {
                    const info = LABEL_FIELD_INFO[field];
                    const value = label[field] ?? "";
                    return (
                      <label key={field}>
                        <span>{isBox && field === "message" ? "Mensagem para a caixa" : info.label} (opcional)</span>
                        {info.multiline ? (
                          <textarea
                            rows={2}
                            maxLength={info.maxLength}
                            value={value}
                            placeholder={info.placeholder}
                            onChange={(e) => setLabelField(field, e.target.value)}
                          />
                        ) : (
                          <input
                            type="text"
                            maxLength={info.maxLength}
                            value={value}
                            placeholder={info.placeholder}
                            onChange={(e) => setLabelField(field, e.target.value)}
                          />
                        )}
                        <Counter value={value} max={info.maxLength} />
                      </label>
                    );
                  })}
                  {product.options.packaging && (
                    <label>
                      <span>Embalagem (opcional)</span>
                      <input
                        type="text"
                        maxLength={TEXT_LIMITS.packaging}
                        value={packaging}
                        placeholder="Modelo ou cor desejados — confirmamos no atendimento"
                        onChange={(e) => setPackaging(e.target.value)}
                      />
                      <Counter value={packaging} max={TEXT_LIMITS.packaging} />
                    </label>
                  )}
                </div>
              )}

              {product.options.referenceImage && (
                <label className="cmodal__check">
                  <input type="checkbox" checked={hasReference} onChange={(e) => setHasReference(e.target.checked)} />
                  <span>
                    Tenho uma imagem ou referência para enviar.
                    <small>Você encaminha o arquivo direto pelo WhatsApp, depois de enviar a solicitação.</small>
                  </span>
                </label>
              )}

              {product.options.notes && (
                <label className="cmodal__notes">
                  <span>Observações (opcional)</span>
                  <textarea
                    rows={2}
                    maxLength={TEXT_LIMITS.notes}
                    value={notes}
                    placeholder="Ocasião, cores, detalhes importantes..."
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <Counter value={notes} max={TEXT_LIMITS.notes} />
                </label>
              )}

              <section className="cmodal__summary" aria-label="Resumo da encomenda">
                <h3>Resumo da encomenda</h3>
                <dl>
                  <div>
                    <dt>{isBox ? "Caixas" : "Quantidade"}</dt>
                    <dd>
                      {detail.totalQuantity}{" "}
                      {isBox ? (detail.totalQuantity === 1 ? "caixa" : "caixas") : unitWord(detail.totalQuantity)}
                    </dd>
                  </div>
                  {detail.unitCents === null ? (
                    <div>
                      <dt>Valor</dt>
                      <dd>Solicite um orçamento.</dd>
                    </div>
                  ) : (
                    <>
                      <div>
                        <dt>{isBox ? "Valor da caixa" : "Preço unitário"}</dt>
                        <dd>
                          {prefix}
                          {formatCents(detail.unitCents)}
                        </dd>
                      </div>
                      {detail.discountPercent > 0 && detail.finalUnitCents !== null && (
                        <>
                          <div>
                            <dt>Desconto aplicado</dt>
                            <dd>{detail.discountPercent}%</dd>
                          </div>
                          <div>
                            <dt>Preço unitário final</dt>
                            <dd>{formatCents(detail.finalUnitCents)}</dd>
                          </div>
                          <div>
                            <dt>Economia</dt>
                            <dd>{formatCents(detail.savingsCents)}</dd>
                          </div>
                        </>
                      )}
                      <div className="is-total">
                        <dt>Subtotal estimado</dt>
                        <dd>
                          {prefix}
                          {formatCents(detail.subtotalCents ?? 0)}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
                {detail.pendingItems.length > 0 && (
                  <p className="cmodal__note">Itens com valor a combinar: {detail.pendingItems.join(", ")}.</p>
                )}
                <p className="cmodal__note">
                  Valor estimado: arte, embalagem e condições finais são confirmados no atendimento.
                </p>
              </section>

              <div className="cmodal__footer">
                {errors.length > 0 && (
                  <ul className="cmodal__errors" role="status">
                    {errors.slice(0, 3).map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                )}
                <button type="button" className="btn btn--primary pmodal__add" onClick={handleAdd} disabled={!canAdd}>
                  <ShoppingCart size={18} aria-hidden="true" />
                  {editLine ? "Salvar alterações" : "Adicionar à encomenda"}
                  {detail.subtotalCents !== null && canAdd ? ` · ${prefix}${formatCents(detail.subtotalCents)}` : ""}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomProductModal() {
  const { customDialog, closeCustom } = useUI();
  if (!customDialog) return null;
  const { product, editLine } = customDialog;
  return (
    <CustomDialog
      key={`${product.id}-${editLine?.key ?? "new"}`}
      product={product}
      editLine={editLine}
      onClose={closeCustom}
    />
  );
}
