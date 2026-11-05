import { MessageCircle, ShoppingCart, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { getCategory } from "../../data/categories";
import { STORE_CONFIG } from "../../data/settings";
import { useUI } from "../../context/UIContext";
import { useCart } from "../../hooks/useCart";
import { useDialogBehavior } from "../../hooks/useDialogBehavior";
import { CUSTOMIZATION_LABELS, createLine } from "../../services/cart";
import { buildConsultMessage, storeWhatsAppUrl } from "../../services/whatsapp";
import { isKit } from "../../services/kits";
import KitDialog from "../KitModal/KitModal";
import type { CustomizationField, CustomizationValues, Product } from "../../types";
import { formatPrice } from "../../utils/format";
import ProductImage from "../ProductImage/ProductImage";
import QuantityStepper from "../QuantityStepper/QuantityStepper";
import "./ProductModal.css";

const FIELD_PLACEHOLDERS: Record<CustomizationField, string> = {
  labelName: "Nome que deve aparecer no rótulo",
  giftMessage: "Mensagem que acompanhará o presente",
  notes: "Alguma observação sobre o pedido?"
};

function ProductDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addLines } = useCart();
  const { showToast } = useUI();
  const panelRef = useRef<HTMLDivElement>(null);
  const max = STORE_CONFIG.maxQuantityPerLine;
  useDialogBehavior(panelRef, true, onClose);

  const hasAromas = product.aromas.length > 0;
  const [aromaQty, setAromaQty] = useState<Record<string, number>>({});
  const [singleQty, setSingleQty] = useState(1);
  const [custom, setCustom] = useState<CustomizationValues>({});
  const images = useMemo(
    () => [product.image, ...(product.gallery ?? [])].filter((i): i is string => Boolean(i)),
    [product]
  );
  const [imageIndex, setImageIndex] = useState(0);

  const category = getCategory(product.category);
  const unavailable = !product.available;
  const onRequest = product.price === null;
  const totalQty = hasAromas
    ? product.aromas.reduce((sum, a) => sum + (aromaQty[a] ?? 0), 0)
    : singleQty;
  const total = onRequest ? 0 : (product.price as number) * totalQty;
  const canAdd = !unavailable && !onRequest && totalQty > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    const lines = hasAromas
      ? product.aromas
          .filter((a) => (aromaQty[a] ?? 0) > 0)
          .map((a) => createLine(product.id, a, aromaQty[a], custom))
      : [createLine(product.id, null, singleQty, custom)];
    addLines(lines);
    showToast(`${product.name} adicionado ao carrinho`);
    onClose();
  };

  return (
    <div className="pmodal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className="pmodal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pmodal-title"
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

        <div className="pmodal__info">
          <span className="pmodal__category">{category?.label ?? product.category}</span>
          <h2 id="pmodal-title" className="pmodal__title">
            {product.name}
          </h2>
          <p className="pmodal__description">{product.description}</p>

          <div className="pmodal__price">
            {onRequest ? (
              <span className="pmodal__price-consult">Preço sob consulta</span>
            ) : (
              <>
                {product.originalPrice && <s>{formatPrice(product.originalPrice)}</s>}
                <strong>{formatPrice(product.price as number)}</strong>
              </>
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
              {hasAromas ? (
                <fieldset className="pmodal__aromas">
                  <legend>Escolha os aromas e quantidades</legend>
                  <ul>
                    {product.aromas.map((aroma) => (
                      <li key={aroma} className={(aromaQty[aroma] ?? 0) > 0 ? "is-selected" : ""}>
                        <span>{aroma}</span>
                        <QuantityStepper
                          size="sm"
                          label={aroma}
                          value={aromaQty[aroma] ?? 0}
                          max={max}
                          onChange={(v) => setAromaQty((q) => ({ ...q, [aroma]: v }))}
                        />
                      </li>
                    ))}
                  </ul>
                </fieldset>
              ) : (
                <div className="pmodal__qty">
                  <span>Quantidade</span>
                  <QuantityStepper label="Quantidade" min={1} max={max} value={singleQty} onChange={setSingleQty} />
                </div>
              )}

              {product.customization && product.customization.fields.length > 0 && (
                <div className="pmodal__custom">
                  {product.customization.fields.map((field) => (
                    <label key={field}>
                      <span>{CUSTOMIZATION_LABELS[field]} (opcional)</span>
                      {field === "labelName" ? (
                        <input
                          type="text"
                          maxLength={60}
                          value={custom[field] ?? ""}
                          placeholder={FIELD_PLACEHOLDERS[field]}
                          onChange={(e) => setCustom((c) => ({ ...c, [field]: e.target.value }))}
                        />
                      ) : (
                        <textarea
                          rows={2}
                          maxLength={240}
                          value={custom[field] ?? ""}
                          placeholder={FIELD_PLACEHOLDERS[field]}
                          onChange={(e) => setCustom((c) => ({ ...c, [field]: e.target.value }))}
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}

              <button type="button" className="btn btn--primary pmodal__add" onClick={handleAdd} disabled={!canAdd}>
                <ShoppingCart size={18} aria-hidden="true" />
                {canAdd ? `Adicionar ao carrinho · ${formatPrice(total)}` : "Selecione uma quantidade"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductModal() {
  const { selectedProduct, kitEdit, closeProduct } = useUI();
  if (!selectedProduct) return null;
  if (isKit(selectedProduct)) {
    return (
      <KitDialog
        key={`${selectedProduct.id}-${kitEdit?.group.key ?? "new"}-${kitEdit?.focusUnitId ?? ""}${kitEdit?.addUnit ? "-add" : ""}`}
        product={selectedProduct}
        edit={kitEdit}
        onClose={closeProduct}
      />
    );
  }
  return <ProductDialog key={selectedProduct.id} product={selectedProduct} onClose={closeProduct} />;
}
