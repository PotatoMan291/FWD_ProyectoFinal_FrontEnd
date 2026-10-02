import { Link } from "react-router-dom";
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
  const formattedPrice = new Intl.NumberFormat(
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
          alt={`Experiencia turística: ${nombre}`}
          className="tour-card-image"
        />

        <span className="tour-card-category">
          {categoria}
        </span>
      </div>

      <div className="tour-card-content">
        <div className="tour-card-location">
          <Icon
            name="mapPin"
            size={15}
          />

          <span>{ubicacion}</span>
        </div>

        <h3>{nombre}</h3>

        <p className="tour-card-description">
          {descripcion}
        </p>

        <div className="tour-card-meta">
          <span>
            <Icon
              name="clock"
              size={15}
            />

            {duracion}
          </span>

          <span>
            <Icon
              name="users"
              size={15}
            />

            {personas}
          </span>
        </div>

        {caracteristicas.length > 0 && (
          <div className="tour-card-features">
            {caracteristicas
              .slice(0, 3)
              .map((caracteristica) => (
                <span
                  className="tour-feature-badge"
                  key={caracteristica}
                >
                  {caracteristica}
                </span>
              ))}
          </div>
        )}

        <div className="tour-card-operator">
          Operado por{" "}
          <strong>{operador}</strong>
        </div>

        <div className="tour-card-footer">
          <div>
            <span className="tour-card-price-label">
              Desde
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
              Ver detalles
            </Link>

            <button
              type="button"
              className={`tour-compare-button ${
                isCompared ? "active" : ""
              }`}
              onClick={() => onCompare(id)}
              aria-pressed={isCompared}
              aria-label={
                isCompared
                  ? `Quitar ${nombre} de la comparación`
                  : `Agregar ${nombre} a la comparación`
              }
            >
              {isCompared && (
                <Icon
                  name="check"
                  size={15}
                />
              )}

              {isCompared
                ? "Comparando"
                : "Comparar"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TourCard;