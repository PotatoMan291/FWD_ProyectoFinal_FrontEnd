import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

import AccessibilityPanel from "./AccessibilityPanel";
import Icon from "./Icon";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const { t } = useLanguage();

  const handleLogout = async () => {
    const result =
      await Swal.fire({
        icon: "question",
        title: t(
          "navbar.logoutTitle"
        ),
        text: t(
          "navbar.logoutText"
        ),
        showCancelButton: true,
        confirmButtonText: t(
          "navbar.logoutConfirm"
        ),
        cancelButtonText: t(
          "navbar.cancel"
        ),
        confirmButtonColor: "#176a4e",
        cancelButtonColor: "#56665f",
      });

    if (!result.isConfirmed) {
      return;
    }

    logout();

    await Swal.fire({
      icon: "success",
      title: t(
        "navbar.logoutSuccess"
      ),
      text: t(
        "navbar.logoutSuccessText"
      ),
      timer: 1400,
      showConfirmButton: false,
    });

    navigate("/", {
      replace: true,
    });
  };

  const getRoleLabel = () => {
    if (user?.rol === "admin") {
      return t(
        "navbar.administrator"
      );
    }

    if (user?.rol === "operador") {
      return t(
        "navbar.operator"
      );
    }

    return t("navbar.tourist");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-brand"
          aria-label={t(
            "navbar.brandLabel"
          )}
        >
          <img
            src="/logo.png"
            alt="PuraVida Trips"
            className="navbar-logo"
          />
        </Link>

        <nav
          className="navbar-links"
          aria-label={t(
            "navbar.home"
          )}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            {t("navbar.home")}
          </NavLink>

          <NavLink
            to="/tours"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            {t("navbar.explore")}
          </NavLink>

          {isAuthenticated ? (
            <span className="navbar-user">
              {t("navbar.hello")},{" "}
              {user.nombre}
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
              {t("navbar.login")}
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          <AccessibilityPanel />

          {!isAuthenticated ? (
            <Link
              to="/register"
              className="navbar-action"
            >
              {t(
                "navbar.register"
              )}
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
                <Icon
                  name="logout"
                  size={15}
                />

                {t("navbar.logout")}
              </button>
            </>
          )}

          {!isAuthenticated && (
            <Link
              to="/tours"
              className="navbar-action navbar-action-secondary"
            >
              {t(
                "navbar.exploreTours"
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;