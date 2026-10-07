import { Link } from "react-router-dom";

function Forbidden() {
  return (
    <main className="page-container not-found">
      <p className="section-eyebrow">
        403
      </p>

      <h1>Acceso denegado</h1>

      <p>
        No tienes permisos para acceder a esta sección.
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

export default Forbidden;