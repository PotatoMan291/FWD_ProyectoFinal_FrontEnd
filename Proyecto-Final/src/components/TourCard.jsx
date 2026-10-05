import { Link } from "react-router-dom";

import {
  useLanguage,
} from "../context/LanguageContext";

import Icon from "./Icon";

function TourCard({
  id,
  nombre,
  categoria,
  ubicacion,
  precio,
  duracion,
  personas,
  imagen,
  descripcion,
  caracteristicas = [],
  operador,
  isCompared = false,
  onCompare,
}) {
  const {
    t,
    getTour,
  } = useLanguage();

  const translatedTour =
    getTour({
      id,
      nombre,
      categoria,
      ubicacion,
      duracion,
      personas,
      descripcion,
      caracteristicas,
    });

  const formattedPrice =
    new Intl.NumberFormat(
      "es-CR",
      {
        style: "currency",
        currency: "CRC",
        maximumFractionDigits: 0,
      }
    ).format(precio);

  return (
    <article className="tour-card">
      <div className="tour-card-image-wrapper">
        <img
          src={imagen}
          alt={`${translatedTour.nombre}`}
          className="tour-card-image"
        />

        <span className="tour-card-category">
          {translatedTour.categoria}
        </span>
      </div>

      <div className="tour-card-content">
        <div className="tour-card-location">
          <Icon
            name="mapPin"
            size={15}
          />

          <span>
            {translatedTour.ubicacion}
          </span>
        </div>

        <h3>
          {translatedTour.nombre}
        </h3>

        <p className="tour-card-description">
          {translatedTour.descripcion}
        </p>

        <div className="tour-card-meta">
          <span>
            <Icon
              name="clock"
              size={15}
            />

            {translatedTour.duracion}
          </span>

          <span>
            <Icon
              name="users"
              size={15}
            />

            {translatedTour.personas}
          </span>
        </div>

        {translatedTour.caracteristicas
          ?.length > 0 && (
          <div className="tour-card-features">
            {translatedTour.caracteristicas
              .slice(0, 3)
              .map(
                (feature) => (
                  <span
                    className="tour-feature-badge"
                    key={feature}
                  >
                    {feature}
                  </span>
                )
              )}
          </div>
        )}

        <div className="tour-card-operator">
          {t("tour.operatedBy")}{" "}
          <strong>{operador}</strong>
        </div>

        <div className="tour-card-footer">
          <div>
            <span className="tour-card-price-label">
              {t("tour.from")}
            </span>

            <strong className="tour-card-price">
              {formattedPrice}
            </strong>
          </div>

          <div className="tour-card-actions">
            <Link
              to={`/tours/${id}`}
              className="tour-card-detail-button"
            >
              {t("tour.details")}
            </Link>

            <button
              type="button"
              className={`tour-compare-button ${
                isCompared
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                onCompare(id)
              }
              aria-pressed={
                isCompared
              }
              aria-label={
                isCompared
                  ? `${t(
                      "tour.removeFromComparison"
                    )}: ${
                      translatedTour.nombre
                    }`
                  : `${t(
                      "tour.addToComparison"
                    )}: ${
                      translatedTour.nombre
                    }`
              }
            >
              {isCompared && (
                <Icon
                  name="check"
                  size={15}
                />
              )}

              {isCompared
                ? t("tour.comparing")
                : t("tour.compare")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TourCard;