import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "¿Cerrar sesión?",
      text:
        "Tu sesión actual se cerrará en este dispositivo.",
      showCancelButton: true,
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor:
        "#176a4e",
      cancelButtonColor:
        "#56665f",
    });

    if (!result.isConfirmed) {
      return;
    }

    logout();

    await Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text:
        "Has cerrado sesión correctamente.",
      timer: 1400,
      showConfirmButton: false,
    });

    navigate("/", {
      replace: true,
    });
  };

  const getRoleLabel = () => {
    if (user?.rol === "admin") {
      return "Administrador";
    }

    if (user?.rol === "operador") {
      return "Operador";
    }

    return "Turista";
  };

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
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/tours"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Explorar
          </NavLink>

          {isAuthenticated ? (
            <span className="navbar-user">
              Hola, {user.nombre}
            </span>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Iniciar sesión
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="navbar-action"
            >
              Crear cuenta
            </Link>
          ) : (
            <>
              <span className="navbar-role">
                {getRoleLabel()}
              </span>

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          )}

          {!isAuthenticated && (
            <Link
              to="/tours"
              className="navbar-action navbar-action-secondary"
            >
              Explorar tours
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;