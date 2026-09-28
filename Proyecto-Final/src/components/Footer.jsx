import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img
              src="/logo.png"
              alt="PuraVida Trips"
            />
          </Link>

          <p>
            Descubre Costa Rica, compara experiencias
            y encuentra tu próxima aventura.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explorar</h3>

          <Link to="/tours">
            Tours
          </Link>

          <Link to="/tours?category=Aventura">
            Aventura
          </Link>

          <Link to="/tours?category=Naturaleza">
            Naturaleza
          </Link>

          <Link to="/tours?category=Playa">
            Playa
          </Link>
        </div>

        <div className="footer-column">
          <h3>Cuenta</h3>

          <Link to="/login">
            Iniciar sesión
          </Link>

          <Link to="/login">
            Registrarse
          </Link>
        </div>

        <div className="footer-column">
          <h3>PuraVida Trips</h3>

          <span>
            Costa Rica
          </span>

          <span>
            Experiencias que conectan
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 PuraVida Trips. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;