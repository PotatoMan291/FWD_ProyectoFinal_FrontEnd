import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page-container not-found">
      <p className="section-eyebrow">
        404
      </p>

      <h1>Página no encontrada</h1>

      <p>
        La página que estás buscando no existe.
      </p>

      <Link
        to="/"
        className="button button-primary"
      >
        Volver al inicio
      </Link>
    </main>
  );
}

export default NotFound;