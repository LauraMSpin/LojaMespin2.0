import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container" style={{ padding: "80px 0", textAlign: "center" }}>
      <h1 className="section-title" style={{ display: "inline-block" }}>
        Página não encontrada
      </h1>
      <p style={{ margin: "24px 0", color: "var(--text-muted)" }}>
        O endereço que você tentou acessar não existe.
      </p>
      <Link to="/" className="btn btn--primary">
        Voltar ao início
      </Link>
    </section>
  );
}
