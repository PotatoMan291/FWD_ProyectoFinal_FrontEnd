import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Icon from "./Icon";
function TourCard({ id, nombre, categoria, ubicacion, precio, duracion, personas, imagen, descripcion, caracteristicas = [], operador, isCompared = false, onCompare }) {
  const { language, t } = useLanguage();
  const formattedPrice = new Intl.NumberFormat(language === "en" ? "en-US" : "es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(precio);
  return <article className="tour-card"><div className="tour-card-image-wrapper"><img src={imagen} alt={nombre} className="tour-card-image" /><span className="tour-card-category">{categoria}</span></div><div className="tour-card-content">
    <div className="tour-card-location"><Icon name="mapPin" size={15} /><span>{ubicacion}</span></div><h3>{nombre}</h3><p className="tour-card-description">{descripcion}</p>
    <div className="tour-card-meta"><span><Icon name="clock" size={15} />{duracion}</span><span><Icon name="users" size={15} />{personas}</span></div>
    {caracteristicas.length > 0 && <div className="tour-card-features">{caracteristicas.slice(0,3).map((item) => <span className="tour-feature-badge" key={item}>{item}</span>)}</div>}
    <div className="tour-card-operator">{language === "en" ? "Operated by" : "Operado por"} <strong>{operador}</strong></div>
    <div className="tour-card-footer"><div><span className="tour-card-price-label">{t("tour.priceFrom")}</span><strong className="tour-card-price">{formattedPrice}</strong></div><div className="tour-card-actions"><Link to={`/tours/${id}`} className="tour-card-detail-button">{t("tour.details")}</Link><button type="button" className={`tour-compare-button ${isCompared ? "active" : ""}`} onClick={() => onCompare(id)} aria-pressed={isCompared}>{isCompared && <Icon name="check" size={15} />}{isCompared ? t("tour.comparing") : t("tour.compare")}</button></div></div>
  </div></article>;
}
export default TourCard;
