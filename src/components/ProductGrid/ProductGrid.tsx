import type { Product } from "../../types";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductGrid.css";

interface Props {
  products: Product[];
  emptyMessage?: string;
  onClear?: () => void;
}

export default function ProductGrid({
  products,
  emptyMessage = "Nenhum produto encontrado.",
  onClear
}: Props) {
  if (products.length === 0) {
    return (
      <div className="product-grid__empty" role="status">
        <p>{emptyMessage}</p>
        {onClear && (
          <button type="button" className="btn btn--ghost" onClick={onClear}>
            Limpar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
