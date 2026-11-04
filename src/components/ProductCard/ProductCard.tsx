import { ShoppingCart, MessageCircle } from "lucide-react";
import { getCategory } from "../../data/categories";
import { useCart } from "../../hooks/useCart";
import { requiresSelection } from "../../services/catalog";
import { createLine } from "../../services/cart";
import { buildConsultMessage, storeWhatsAppUrl } from "../../services/whatsapp";
import { useUI } from "../../context/UIContext";
import type { Product } from "../../types";
import { formatPrice } from "../../utils/format";
import ProductImage from "../ProductImage/ProductImage";
import "./ProductCard.css";

export default function ProductCard({ product }: { product: Product }) {
  const { addLines } = useCart();
  const { openProduct, showToast } = useUI();
  const category = getCategory(product.category);
  const soldOut = !product.available;
  const onRequest = product.price === null;

  const handleAdd = () => {
    if (requiresSelection(product)) {
      openProduct(product);
      return;
    }
    addLines([createLine(product.id, null, 1)]);
    showToast(`${product.name} adicionado ao carrinho`);
  };

  return (
    <article className={`product-card ${soldOut ? "is-soldout" : ""}`}>
      <button
        type="button"
        className="product-card__media"
        onClick={() => openProduct(product)}
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <ProductImage src={product.image} alt={product.name} />
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        {soldOut && <span className="product-card__soldout">Esgotado</span>}
      </button>

      <div className="product-card__body">
        <span className="product-card__category">{category?.label ?? product.category}</span>
        <h3 className="product-card__name">
          <button type="button" onClick={() => openProduct(product)}>
            {product.name}
          </button>
        </h3>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__footer">
          <div className="product-card__price">
            {onRequest ? (
              <span className="product-card__price-consult">Sob consulta</span>
            ) : (
              <>
                {product.originalPrice && (
                  <s className="product-card__price-old">{formatPrice(product.originalPrice)}</s>
                )}
                <span>{formatPrice(product.price as number)}</span>
              </>
            )}
          </div>

          {soldOut ? (
            <span className="product-card__btn product-card__btn--disabled" aria-disabled="true">
              Esgotado
            </span>
          ) : onRequest ? (
            <a
              className="product-card__btn"
              href={storeWhatsAppUrl(buildConsultMessage(product))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={15} aria-hidden="true" /> Consultar
            </a>
          ) : (
            <button type="button" className="product-card__btn" onClick={handleAdd}>
              <ShoppingCart size={15} aria-hidden="true" /> Adicionar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
