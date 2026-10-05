import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AccessibilityPanel from "./AccessibilityPanel";
import Icon from "./Icon";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const dashboardPath = user?.rol === "admin" ? "/admin" : user?.rol === "operador" ? "/operador" : "/turista";
  const roleLabel = user?.rol === "admin" ? "Administrador" : user?.rol === "operador" ? "Operador" : "Turista";

  const handleLogout = async () => {
    const result = await Swal.fire({ icon: "question", title: "¿Cerrar sesión?", text: "Tu sesión actual se cerrará en este dispositivo.", showCancelButton: true, confirmButtonText: t("nav.logout"), cancelButtonText: "Cancelar", confirmButtonColor: "#176a4e" });
    if (!result.isConfirmed) return;
    logout();
    await Swal.fire({ icon: "success", title: "Sesión cerrada", timer: 1200, showConfirmButton: false });
    navigate("/", { replace: true });
  };

  return <header className="navbar"><div className="navbar-container">
    <Link to="/" className="navbar-brand" aria-label="PuraVida Trips"><img src="/logo.png" alt="PuraVida Trips" className="navbar-logo" /></Link>
    <nav className="navbar-links" aria-label="Navegación principal">
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t("nav.home")}</NavLink>
      <NavLink to="/tours" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t("nav.explore")}</NavLink>
      {isAuthenticated ? <NavLink to={dashboardPath} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t("nav.dashboard")}</NavLink> : <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t("nav.login")}</NavLink>}
      {isAuthenticated && <span className="navbar-user">Hola, {user.nombre}</span>}
    </nav>
    <div className="navbar-actions"><AccessibilityPanel />
      {!isAuthenticated ? <><Link to="/register" className="navbar-action">{t("nav.register")}</Link><Link to="/tours" className="navbar-action navbar-action-secondary">{t("nav.explore")}</Link></> : <><span className="navbar-role">{roleLabel}</span><button type="button" className="navbar-logout" onClick={handleLogout}><Icon name="logout" size={15} />{t("nav.logout")}</button></>}
    </div>
  </div></header>;
}
export default Navbar;
