import { Link } from "react-router-dom";
import { CATEGORIES } from "../../data/categories";
import { STORE_CONFIG } from "../../data/settings";
import { Icon } from "../Icons/Icon";
import "./CategoryNavigation.css";

interface Props {
  /** "" = todas, id de categoria ou "natal". */
  active?: string;
  /** Destino de cada categoria. */
  getLink: (categoryId: string) => string;
}

export default function CategoryNavigation({ active, getLink }: Props) {
  const items = [
    { id: "", name: "Todas as categorias", icon: "all" },
    ...CATEGORIES.map((c) => ({ id: c.id as string, name: c.name, icon: c.icon })),
    ...(STORE_CONFIG.christmasPageEnabled ? [{ id: "natal", name: "Natal", icon: "natal" }] : [])
  ];

  return (
    <nav className="categories container" aria-label="Categorias">
      <ul className="categories__list">
        {items.map((item) => {
          const isActive = active !== undefined && active === item.id;
          return (
            <li key={item.id || "all"}>
              <Link
                to={getLink(item.id)}
                className={`categories__item ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="categories__circle">
                  <Icon name={item.icon} size={34} strokeWidth={1.4} />
                </span>
                <span className="categories__name">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
