import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HERO_SLIDES } from "../../data/settings";
import { storeWhatsAppUrl } from "../../services/whatsapp";
import type { HeroSlide } from "../../types";
import { asset } from "../../utils/format";
import { scrollToSection } from "../../utils/scroll";
import "./Hero.css";

const AUTOPLAY_MS = 6500;

function SlideButton({ slide }: { slide: HeroSlide }) {
  const content = (
    <>
      {slide.ctaLabel} <ArrowRight size={16} aria-hidden="true" />
    </>
  );
  const { action } = slide;
  if (action.type === "route") {
    return (
      <Link to={action.to} className="btn btn--outline hero__cta">
        {content}
      </Link>
    );
  }
  if (action.type === "whatsapp") {
    return (
      <a
        href={storeWhatsAppUrl(action.message)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--outline hero__cta"
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" className="btn btn--outline hero__cta" onClick={() => scrollToSection(action.id)}>
      {content}
    </button>
  );
}

export default function Hero() {
  const slides = HERO_SLIDES;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduce || slides.length < 2) return;
    const timer = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, go, slides.length]);

  return (
    <section
      className="hero container"
      aria-roledescription="carrossel"
      aria-label="Destaques da Mespín"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero__stage">
        {slides.map((slide, i) => (
          <article
            key={slide.id}
            className={`hero__slide hero__slide--${slide.layout ?? "full"} ${i === index ? "is-active" : ""}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${slides.length}`}
            aria-hidden={i !== index}
          >
            <div className="hero__media">
              <img
                src={asset(slide.image)}
                alt={i === index ? slide.alt : ""}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
            <div className="hero__content">
              <h1 className="hero__title">{slide.title}</h1>
              <span className="hero__rule" aria-hidden="true" />
              <p className="hero__subtitle">{slide.subtitle}</p>
              {i === index ? (
                <SlideButton slide={slide} />
              ) : null}
            </div>
          </article>
        ))}

        {slides.length > 1 && (
          <>
            <button type="button" className="hero__arrow hero__arrow--prev" onClick={() => go(index - 1)} aria-label="Slide anterior">
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button type="button" className="hero__arrow hero__arrow--next" onClick={() => go(index + 1)} aria-label="Próximo slide">
              <ChevronRight size={22} aria-hidden="true" />
            </button>
            <div className="hero__dots">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`hero__dot ${i === index ? "is-active" : ""}`}
                  onClick={() => go(i)}
                  aria-label={`Ir para o slide ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
