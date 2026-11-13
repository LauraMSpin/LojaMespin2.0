import { ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";
import { FAQ_ITEMS, FAQ_MESPITO } from "../../data/faq";
import { storeWhatsAppUrl } from "../../services/whatsapp";
import { asset } from "../../utils/format";
import Reveal from "../Reveal";
import "./MespitoFaq.css";

export default function MespitoFaq() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section id="duvidas" className="mfaq container" aria-labelledby="mfaq-title">
      <Reveal className="mfaq__inner">
        <div className="mfaq__mascot">
          <p className="mfaq__bubble">
            <strong>{FAQ_MESPITO.catchphrase}</strong>
            <span>{FAQ_MESPITO.intro}</span>
          </p>
          <img src={asset("assets/mespito/mespito.png")} alt={FAQ_MESPITO.imageAlt} loading="lazy" />
        </div>

        <div className="mfaq__content">
          <h2 id="mfaq-title" className="section-title">
            {FAQ_MESPITO.title}
          </h2>
          <ul className="mfaq__list">
            {FAQ_ITEMS.map((item) => {
              const open = openId === item.id;
              return (
                <li key={item.id} className={open ? "is-open" : ""}>
                  <h3>
                    <button
                      type="button"
                      id={`mfaq-btn-${item.id}`}
                      aria-expanded={open}
                      aria-controls={`mfaq-panel-${item.id}`}
                      onClick={() => setOpenId(open ? null : item.id)}
                    >
                      {item.q}
                      <ChevronDown size={20} aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={`mfaq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`mfaq-btn-${item.id}`}
                    hidden={!open}
                  >
                    <p>{item.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mfaq__cta">
            <span>{FAQ_MESPITO.ctaText}</span>
            <a
              className="btn btn--whatsapp"
              href={storeWhatsAppUrl(FAQ_MESPITO.ctaMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" /> {FAQ_MESPITO.ctaLabel}
            </a>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
