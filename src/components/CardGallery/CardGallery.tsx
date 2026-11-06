import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import ProductImage from "../ProductImage/ProductImage";
import "./CardGallery.css";

interface Props {
  image?: string;
  gallery?: string[];
  alt: string;
  /** Clique na foto (abre o produto). */
  onOpen: () => void;
  openLabel: string;
  disabled?: boolean;
  /** Selos sobre a foto (ex.: "Natal", "Esgotado"); não interceptam cliques. */
  children?: ReactNode;
}

/** Foto do cartão do catálogo, com setas e pontos para ver as outras fotos sem abrir o produto. */
export default function CardGallery({ image, gallery, alt, onOpen, openLabel, disabled, children }: Props) {
  const images = useMemo(
    () => [...new Set([image, ...(gallery ?? [])].filter((i): i is string => Boolean(i)))],
    [image, gallery]
  );
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = Math.min(index, Math.max(count - 1, 0));
  const many = count > 1;

  const go = (step: number) => setIndex((current + step + count) % count);

  return (
    <div className="product-card__media">
      <button type="button" className="product-card__open" onClick={onOpen} aria-label={openLabel} disabled={disabled}>
        <ProductImage
          key={images[current]}
          src={images[current]}
          alt={many ? `${alt} (foto ${current + 1} de ${count})` : alt}
        />
      </button>
      {children}
      {many && (
        <>
          <button
            type="button"
            className="card-gallery__arrow card-gallery__arrow--prev"
            onClick={() => go(-1)}
            aria-label={`Foto anterior de ${alt}`}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="card-gallery__arrow card-gallery__arrow--next"
            onClick={() => go(1)}
            aria-label={`Próxima foto de ${alt}`}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          <div className="card-gallery__dots" aria-hidden="true">
            {images.map((src, i) => (
              <span key={src} className={i === current ? "is-active" : ""} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
