import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-brand"
          aria-label="PuraVida Trips - Inicio"
        >
          <img
            src="/logo.png"
            alt="PuraVida Trips"
            className="navbar-logo"
          />
        </Link>

        <nav
          className="navbar-links"
          aria-label="Navegación principal"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/tours"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Explorar
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Iniciar sesión
          </NavLink>
        </nav>

        <Link
          to="/tours"
          className="navbar-action"
        >
          Explorar tours
        </Link>
      </div>
    </header>
  );
}

export default Navbar;