import { Check, Percent } from "lucide-react";
import { useUI } from "../../context/UIContext";
import type { CustomProduct } from "../../types";
import { formatCents } from "../../utils/format";
import ProductImage from "../ProductImage/ProductImage";
import "../ProductCard/ProductCard.css";
import "./CustomProductCard.css";

const unitWord = (n: number) => (n === 1 ? "unidade" : "unidades");

/** Texto da regra de quantidade mínima do produto. */
export function minimumText(product: CustomProduct): string {
  const n = product.minimumQuantity;
  if (product.kind === "box") return `Quantidade mínima: ${n} ${n === 1 ? "caixa" : "caixas"}.`;
  const scope = product.minimumScope === "perAroma" && product.options.aromas.length > 0 ? " por aroma" : "";
  return `Quantidade mínima: ${n} ${unitWord(n)}${scope}.`;
}

function customizationSummary(product: CustomProduct): string[] {
  const items: string[] = [];
  if (product.kind === "box") items.push("Você escolhe os itens da caixa");
  if (product.options.aromas.length > 0) items.push("Escolha de aroma");
  if (product.options.labelFields.length > 0) items.push("Personalização de etiqueta");
  if (product.options.packaging) items.push("Embalagem personalizável");
  return items;
}

export default function CustomProductCard({ product }: { product: CustomProduct }) {
  const { openCustom } = useUI();
  const unavailable = !product.available;
  const priceText =
    product.basePrice === null
      ? "Solicite um orçamento"
      : `${product.priceFrom ? "A partir de " : ""}${formatCents(Math.round(product.basePrice * 100))}${product.kind === "box" ? "" : " cada"}`;

  return (
    <article className={`product-card custom-card ${unavailable ? "is-soldout" : ""}`}>
      <button
        type="button"
        className="product-card__media"
        onClick={() => openCustom(product)}
        aria-label={`Personalizar ${product.name}`}
        disabled={unavailable}
      >
        <ProductImage src={product.image} alt={product.name} />
        <span className="product-card__badge custom-card__badge">Sob encomenda</span>
        {unavailable && <span className="product-card__soldout">Indisponível</span>}
      </button>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <button type="button" onClick={() => openCustom(product)} disabled={unavailable}>
            {product.name}
          </button>
        </h3>
        <p className="product-card__description">{product.description}</p>

        <ul className="custom-card__facts">
          <li className="custom-card__min">{minimumText(product)}</li>
          {customizationSummary(product).map((text) => (
            <li key={text}>
              <Check size={14} aria-hidden="true" />
              {text}
            </li>
          ))}
          {product.discountTiers.length > 0 && (
            <li>
              <Percent size={14} aria-hidden="true" />
              Descontos progressivos para grandes quantidades
            </li>
          )}
        </ul>

        <div className="product-card__footer">
          <div className="product-card__price">
            <span className={product.basePrice === null ? "product-card__price-consult" : ""}>{priceText}</span>
          </div>
          <button
            type="button"
            className="product-card__btn"
            onClick={() => openCustom(product)}
            disabled={unavailable}
          >
            Personalizar
          </button>
        </div>
      </div>
    </article>
  );
}
