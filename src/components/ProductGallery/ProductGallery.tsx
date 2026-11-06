import { useMemo, useState } from "react";
import ProductImage from "../ProductImage/ProductImage";
import "../ProductModal/ProductModal.css";

interface Props {
  image?: string;
  gallery?: string[];
  alt: string;
}

/** Foto principal + miniaturas para alternar entre as fotos (faixa só aparece com 2 ou mais). */
export default function ProductGallery({ image, gallery, alt }: Props) {
  const images = useMemo(
    () => [...new Set([image, ...(gallery ?? [])].filter((i): i is string => Boolean(i)))],
    [image, gallery]
  );
  const [index, setIndex] = useState(0);
  const current = Math.min(index, Math.max(images.length - 1, 0));
  const many = images.length > 1;

  return (
    <div className="pmodal__media">
      <div className="pmodal__image">
        <ProductImage
          key={images[current]}
          src={images[current]}
          alt={many ? `${alt} (foto ${current + 1} de ${images.length})` : alt}
          fit="contain"
          loading="eager"
        />
      </div>
      {many && (
        <div className="pmodal__thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={i === current ? "is-active" : ""}
              onClick={() => setIndex(i)}
              aria-label={`Ver imagem ${i + 1} de ${images.length}`}
              aria-current={i === current}
            >
              <ProductImage src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
