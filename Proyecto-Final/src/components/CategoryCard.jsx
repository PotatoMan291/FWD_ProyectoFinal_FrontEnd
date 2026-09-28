import { Link } from "react-router-dom";

function CategoryCard({
  icon,
  title,
  description,
  search,
}) {
  return (
    <Link
      to={`/tours?categoria=${encodeURIComponent(
        search || title
      )}`}
      className="category-card"
    >
      <span
        className="category-card-icon"
        aria-hidden="true"
      >
        {icon}
      </span>

      <h3>{title}</h3>

      <p>{description}</p>

      <span className="category-card-link">
        Explorar
        <span aria-hidden="true"> →</span>
      </span>
    </Link>
  );
}

export default CategoryCard;