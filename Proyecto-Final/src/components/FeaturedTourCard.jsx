import { Link } from "react-router-dom";

function FeaturedTourCard({
  image,
  category,
  title,
  location,
  price,
}) {
  return (
    <article className="tour-card">
      <div className="tour-card-image">
        {image ? (
          <img
            src={image}
            alt={title}
          />
        ) : (
          <div className="tour-card-placeholder">
            PuraVida Trips
          </div>
        )}
      </div>

      <div className="tour-card-content">
        <span className="tour-card-category">
          {category}
        </span>

        <h3>{title}</h3>

        <p className="tour-card-location">
          {location}
        </p>

        <div className="tour-card-footer">
          <strong>
            Desde ₡{Number(price).toLocaleString("es-CR")}
          </strong>

          <Link to="/tours">
            Ver tour →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default FeaturedTourCard;