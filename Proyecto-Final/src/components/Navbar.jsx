import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          PuraVida Trips
        </Link>

        <nav className="navbar-links" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/tours">Tours</Link>
          <Link to="/login">Iniciar sesión</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;