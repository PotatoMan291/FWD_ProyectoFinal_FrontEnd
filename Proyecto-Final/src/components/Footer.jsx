import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
function Footer() {
  const { t } = useLanguage();
  return <footer className="footer"><div className="footer-container">
    <div className="footer-brand"><Link to="/" className="footer-logo"><img src="/logo.png" alt="PuraVida Trips" /></Link><p>{t("footer.description")}</p></div>
    <div className="footer-column"><h3>{t("footer.explore")}</h3><Link to="/tours">{t("footer.tours")}</Link><Link to="/tours?categoria=Aventura">{t("home.categories.adventure")}</Link><Link to="/tours?categoria=Naturaleza">{t("home.categories.nature")}</Link><Link to="/tours?categoria=Playa">{t("home.categories.beach")}</Link></div>
    <div className="footer-column"><h3>{t("footer.account")}</h3><Link to="/login">{t("nav.login")}</Link><Link to="/register">{t("nav.register")}</Link></div>
    <div className="footer-column"><h3>{t("footer.brand")}</h3><span>{t("footer.country")}</span><span>{t("footer.tagline")}</span></div>
  </div><div className="footer-bottom"><p>© 2026 PuraVida Trips. {t("footer.rights")}</p></div></footer>;
}
export default Footer;
