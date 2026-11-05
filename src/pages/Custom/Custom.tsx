import { ArrowRight, ChevronDown, X, MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import CustomProductCard from "../../components/CustomProductCard/CustomProductCard";
import { Icon } from "../../components/Icons/Icon";
import Reveal from "../../components/Reveal";
import { CUSTOM_PAGE } from "../../data/customPage";
import { CUSTOM_PRODUCTS } from "../../data/customProducts";
import { useDialogBehavior } from "../../hooks/useDialogBehavior";
import { storeWhatsAppUrl } from "../../services/whatsapp";
import { asset } from "../../utils/format";
import { scrollToSection } from "../../utils/scroll";
import "../../components/ProductGrid/ProductGrid.css";
import "./Custom.css";

function Lightbox({ index, onClose, onChange }: { index: number; onClose: () => void; onChange: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogBehavior(ref, true, onClose);
  const items = CUSTOM_PAGE.gallery.items;
  const item = items[index];
  return (
    <div className="lightbox" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className="lightbox__panel" role="dialog" aria-modal="true" aria-label="Foto ampliada" tabIndex={-1}>
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Fechar">
          <X size={22} aria-hidden="true" />
        </button>
        <img src={asset(item.image)} alt={item.alt} />
        <div className="lightbox__nav">
          <button type="button" onClick={() => onChange((index - 1 + items.length) % items.length)}>
            Anterior
          </button>
          <span>
            {index + 1} / {items.length}
          </span>
          <button type="button" onClick={() => onChange((index + 1) % items.length)}>
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Custom() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!CUSTOM_PAGE.enabled) return <Navigate to="/" replace />;

  const { hero, intro, gallery, process, faq, cta } = CUSTOM_PAGE;
  const products = [...CUSTOM_PRODUCTS].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="custom-page">
      <section className="custom-hero container" aria-labelledby="custom-title">
        <div className="custom-hero__stage">
          <div className="custom-hero__content">
            <h1 id="custom-title" className="fade-in">
              {hero.title}
            </h1>
            <span className="custom-hero__rule" aria-hidden="true" />
            <p className="fade-in">{hero.description}</p>
            <button
              type="button"
              className="btn btn--outline custom-hero__cta"
              onClick={() => scrollToSection("personalizados-produtos")}
            >
              {hero.ctaLabel} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="custom-hero__collage">
            {hero.collage.map((photo, i) => (
              <figure key={photo.image} className={`custom-hero__photo custom-hero__photo--${i + 1}`}>
                <img src={asset(photo.image)} alt={photo.alt} loading={i < 2 ? "eager" : "lazy"} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="custom-intro container">
        <Reveal>
          <h2 className="section-title">{intro.title}</h2>
          <p>{intro.text}</p>
        </Reveal>
      </section>

      <section id="personalizados-produtos" className="custom-products container" aria-label="Produtos sob encomenda">
        <h2 className="section-title">Escolha seu produto</h2>
        <div className="product-grid custom-products__grid">
          {products.map((product) => (
            <CustomProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="custom-gallery container" aria-labelledby="gallery-title">
        <Reveal>
          <h2 id="gallery-title" className="section-title">
            {gallery.title}
          </h2>
          <p className="custom-gallery__intro">{gallery.intro}</p>
          <ul className="custom-gallery__grid">
            {gallery.items.map((item, i) => (
              <li key={item.image}>
                <button type="button" onClick={() => setLightbox(i)} aria-label={`Ampliar foto ${i + 1}: ${item.alt}`}>
                  <img src={asset(item.image)} alt="" loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="custom-process" aria-labelledby="process-title">
        <Reveal className="container">
          <h2 id="process-title" className="section-title">
            {process.title}
          </h2>
          <ol className="custom-process__steps">
            {process.steps.map((step, i) => (
              <li key={step.title}>
                <span className="custom-process__icon">
                  <Icon name={step.icon} size={26} strokeWidth={1.5} />
                </span>
                <span className="custom-process__number">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="custom-faq container" aria-labelledby="faq-title">
        <Reveal>
          <h2 id="faq-title" className="section-title">
            {faq.title}
          </h2>
          <ul className="custom-faq__list">
            {faq.items.map((item, i) => {
              const open = openFaq === i;
              return (
                <li key={item.q} className={open ? "is-open" : ""}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-btn-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      {item.q}
                      <ChevronDown size={20} aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} hidden={!open}>
                    <p>{item.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      <section className="custom-cta container">
        <Reveal className="custom-cta__box">
          <div>
            <h2>{cta.title}</h2>
            <p>{cta.text}</p>
          </div>
          <a className="btn btn--whatsapp" href={storeWhatsAppUrl(cta.message)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden="true" /> {cta.buttonLabel}
          </a>
        </Reveal>
      </section>

      {lightbox !== null && <Lightbox index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />}
    </div>
  );
}
