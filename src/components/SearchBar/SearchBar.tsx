import { Search } from "lucide-react";
import type { FormEvent } from "react";
import "./SearchBar.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Buscar produtos...",
  label = "Buscar produtos",
  className = ""
}: Props) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form className={`searchbar ${className}`} role="search" onSubmit={handleSubmit}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      <button type="submit" aria-label="Pesquisar">
        <Search size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
