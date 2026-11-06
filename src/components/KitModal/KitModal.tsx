import { MessageCircle, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { STORE_CONFIG } from "../../data/settings";
import { getCategory } from "../../data/categories";
import { useUI, type KitEditState } from "../../context/UIContext";
import { useCart } from "../../hooks/useCart";
import { useDialogBehavior } from "../../hooks/useDialogBehavior";
import {
  copySelections,
  createKitGroup,
  createUnit,
  getSlots,
  matchesPrevious,
  validateKitGroup
} from "../../services/kits";
import { buildConsultMessage, storeWhatsAppUrl } from "../../services/whatsapp";
import type { KitUnit, Product } from "../../types";
import { formatPrice } from "../../utils/format";
import ProductImage from "../ProductImage/ProductImage";
import QuantityStepper from "../QuantityStepper/QuantityStepper";
import "../ProductModal/ProductModal.css";
import "./KitModal.css";

interface Props {
  product: Product;
  edit: KitEditState | null;
  onClose: () => void;
}

export default function KitDialog({ product, edit, onClose }: Props) {
  const { addKitGroup, replaceKitGroup } = useCart();
  const { showToast } = useUI();
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehavior(panelRef, true, onClose);

  const max = STORE_CONFIG.maxKitUnits;
  const slots = useMemo(() => getSlots(product), [product]);
  const images = useMemo(
    () => [product.image, ...(product.gallery ?? [])].filter((i): i is string => Boolean(i)),
    [product]
  );
  const [imageIndex, setImageIndex] = useState(0);
  const category = getCategory(product.category);
  const onRequest = product.price === null;
  const unavailable = !product.available;

  const [initial] = useState(() => {
    const units = edit ? edit.group.units.map((u) => createUnit(u.selections, u.id)) : [createUnit()];
    let focusId = edit?.focusUnitId;
    if (edit?.addUnit && units.length < max) {
      const added = createUnit();
      units.push(added);
      focusId = added.id;
    }
    return { units, focusId };
  });
  const [units, setUnits] = useState<KitUnit[]>(initial.units);
  const [focusId, setFocusId] = useState<string | undefined>(initial.focusId);

  useEffect(() => {
    if (!focusId) return;
    document.getElementById(`kit-unit-${focusId}`)?.scrollIntoView({ block: "center" });
    const timer = window.setTimeout(() => setFocusId(undefined), 1800);
    return () => window.clearTimeout(timer);
  }, [focusId]);

  const errors = useMemo(() => validateKitGroup(product, units, max), [product, units, max]);
  const canAdd = !unavailable && !onRequest && errors.length === 0;
  const total = (product.price ?? 0) * units.length;

  const setCount = (count: number) =>
    setUnits((current) =>
      count >= current.length
        ? [...current, ...Array.from({ length: count - current.length }, () => createUnit())]
        : current.slice(0, count)
    );

  const setSelection = (unitId: string, slotId: string, value: string) =>
    setUnits((current) =>
      current.map((u) => {
        if (u.id !== unitId) return u;
        const selections = { ...u.selections };
        if (value) selections[slotId] = value;
        else delete selections[slotId];
        return { ...u, selections };
      })
    );

  const toggleRepeat = (index: number, checked: boolean) =>
    setUnits((current) =>
      current.map((u, i) => {
        if (i !== index) return u;
        return checked ? copySelections(product, current[index - 1], u.id) : createUnit({}, u.id);
      })
    );

  const applyFirstToAll = () =>
    setUnits((current) => current.map((u, i) => (i === 0 ? u : copySelections(product, current[0], u.id))));

  const handleAdd = () => {
    if (!canAdd) return;
    if (edit) {
      replaceKitGroup(edit.group.key, createKitGroup({ key: edit.group.key, productId: product.id, units }));
      showToast("Kits atualizados");
    } else {
      addKitGroup(createKitGroup({ productId: product.id, units }));
      showToast(`${product.name} adicionado ao carrinho`);
    }
    onClose();
  };

  const firstComplete = validateKitGroup(product, units.slice(0, 1), max).length === 0;

  return (
    <div className="pmodal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className="pmodal__panel kmodal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kmodal-title"
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

        <div className="pmodal__info kmodal__info">
          <span className="pmodal__category">{category?.label ?? "Kit"}</span>
          <h2 id="kmodal-title" className="pmodal__title">
            {product.name}
          </h2>
          <p className="pmodal__description">{product.description}</p>

          <div className="pmodal__price">
            {onRequest ? (
              <span className="pmodal__price-consult">Preço sob consulta</span>
            ) : (
              <strong>{formatPrice(product.price as number)}</strong>
            )}
          </div>

          {unavailable ? (
            <p className="pmodal__notice">Produto esgotado no momento.</p>
          ) : onRequest ? (
            <a
              className="btn btn--whatsapp pmodal__add"
              href={storeWhatsAppUrl(buildConsultMessage(product))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" /> Consultar no WhatsApp
            </a>
          ) : (
            <>
              <section className="kmodal__section" aria-labelledby="kmodal-personalize">
                <h3 id="kmodal-personalize">Personalize seu kit</h3>

                <div className="pmodal__qty">
                  <span>Quantidade de kits</span>
                  <QuantityStepper
                    label="Quantidade de kits"
                    min={1}
                    max={max}
                    value={units.length}
                    onChange={setCount}
                  />
                </div>
                {units.length >= max && <p className="kmodal__hint">Máximo de {max} kits por compra.</p>}

                {units.length > 1 && (
                  <button
                    type="button"
                    className="kmodal__apply"
                    onClick={applyFirstToAll}
                    disabled={!firstComplete}
                  >
                    Aplicar o Kit 1 a todos
                  </button>
                )}

                <ol className="kmodal__units">
                  {units.map((unit, index) => {
                    const previous = units[index - 1];
                    const repeated = matchesPrevious(product, previous, unit);
                    const previousComplete = previous ? validateKitGroup(product, [previous], max).length === 0 : false;
                    return (
                      <li
                        key={unit.id}
                        id={`kit-unit-${unit.id}`}
                        className={`kmodal__unit ${focusId === unit.id ? "is-focus" : ""}`}
                      >
                        <div className="kmodal__unit-head">
                          <h4>
                            {product.name} — Unidade {index + 1}
                          </h4>
                        </div>

                        {index > 0 && (
                          <label className="kmodal__repeat">
                            <input
                              type="checkbox"
                              checked={repeated}
                              disabled={!previousComplete && !repeated}
                              onChange={(e) => toggleRepeat(index, e.target.checked)}
                            />
                            <span>Repetir a configuração do kit anterior</span>
                          </label>
                        )}

                        <ul className="kmodal__slots">
                          {slots.map((slot) => {
                            const fieldId = `kit-${unit.id}-${slot.id}`;
                            return (
                              <li key={slot.id}>
                                <div className="kmodal__slot-name">
                                  <label htmlFor={slot.aroma.mode === "choice" ? fieldId : undefined}>{slot.name}</label>
                                  {slot.description && <small>{slot.description}</small>}
                                </div>
                                {slot.aroma.mode === "choice" ? (
                                  <select
                                    id={fieldId}
                                    value={unit.selections[slot.id] ?? ""}
                                    onChange={(e) => setSelection(unit.id, slot.id, e.target.value)}
                                    aria-label={`${slot.name} do kit ${index + 1}: aroma`}
                                  >
                                    <option value="">Selecione o aroma</option>
                                    {slot.aroma.options.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : slot.aroma.mode === "fixed" ? (
                                  <span className="kmodal__fixed">{slot.aroma.value}</span>
                                ) : (
                                  <span className="kmodal__fixed kmodal__fixed--none">Incluso</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ol>
              </section>

              <div className="kmodal__footer">
                {errors.length > 0 && (
                  <div className="kmodal__errors" role="status">
                    <strong>Falta configurar:</strong>
                    <ul>
                      {errors.slice(0, 4).map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                      {errors.length > 4 && <li>e mais {errors.length - 4} escolha(s)…</li>}
                    </ul>
                  </div>
                )}
                <button type="button" className="btn btn--primary pmodal__add" onClick={handleAdd} disabled={!canAdd}>
                  <ShoppingCart size={18} aria-hidden="true" />
                  {edit ? "Salvar alterações" : "Adicionar ao carrinho"}
                  {` · ${formatPrice(total)}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
