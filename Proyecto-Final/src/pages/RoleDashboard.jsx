import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function RoleDashboard({ role }) {
  const { user } = useAuth();

  const roleInfo = {
    turista: {
      title: "Panel del turista",
      description:
        "Aquí podrás gestionar tus favoritos, reservas y perfil.",
    },

    operador: {
      title: "Panel del operador",
      description:
        "Aquí podrás administrar tus tours, disponibilidad y reservas.",
    },

    admin: {
      title: "Panel administrativo",
      description:
        "Aquí podrás gestionar operadores, tours, categorías y contenido.",
    },
  };

  const currentRole =
    roleInfo[role] || roleInfo.turista;

  return (
    <main className="auth-page">
      <section
        className="auth-card"
        aria-labelledby="role-dashboard-title"
      >
        <div className="auth-header">
          <p className="section-eyebrow">
            PURAVIDA TRIPS
          </p>

          <h1 id="role-dashboard-title">
            {currentRole.title}
          </h1>

          <p>
            Hola, {user?.nombre}.
          </p>

          <p>
            {currentRole.description}
          </p>
        </div>

        <div className="auth-demo">
          <p>
            <strong>
              Módulo en construcción
            </strong>
          </p>

          <span>
            Este espacio será reemplazado por el
            panel correspondiente durante las
            siguientes etapas del proyecto.
          </span>
        </div>

        <Link
          to="/"
          className="button button-primary"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}

export default RoleDashboard;