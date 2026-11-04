import { useState } from "react";
import { asset } from "../../utils/format";
import "./ProductImage.css";

interface Props {
  src?: string;
  alt: string;
  /** "contain" mostra a foto inteira (modal); "cover" preenche o cartão. */
  fit?: "cover" | "contain";
  loading?: "lazy" | "eager";
}

export default function ProductImage({ src, alt, fit = "cover", loading = "lazy" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="product-image product-image--placeholder" role="img" aria-label={alt}>
        <img src={asset("assets/logo/logo-mespin.png")} alt="" />
      </div>
    );
  }

  return (
    <img
      className={`product-image product-image--${fit}`}
      src={asset(src)}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}
