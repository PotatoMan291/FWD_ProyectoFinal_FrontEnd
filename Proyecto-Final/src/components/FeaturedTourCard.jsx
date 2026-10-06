import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Icon from "./Icon";
function FeaturedTourCard({ id, image, category, title, location, price }) {
  const { language, t } = useLanguage();
  return <Link to={`/tours/${id}`} className="tour-card featured-tour-card" aria-label={`${t("tour.details")}: ${title}`}><div className="tour-card-image">{image?<img src={image} alt={title}/>:<div className="tour-card-placeholder">PuraVida Trips</div>}</div><div className="tour-card-content"><span className="tour-card-category">{category}</span><h3>{title}</h3><p className="tour-card-location">{location}</p><div className="tour-card-footer"><strong>{t("tour.priceFrom")} ₡{Number(price).toLocaleString(language === "en" ? "en-US" : "es-CR")}</strong><span className="featured-tour-link">{t("tour.details")} <Icon name="arrowRight" size={16}/></span></div></div></Link>;
}
export default FeaturedTourCard;
