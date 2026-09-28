import { Link } from "react-router-dom";

function CategoryCard({
  icon,
  title,
  description,
  search,
}) {
  return (
    <Link
      to={`/tours?category=${encodeURIComponent(search || title)}`}
      className="category-card"
    >
      <div
        className="category-icon"
        aria-hidden="true"
      >
        {icon}
      </div>

      <div>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <span
        className="category-arrow"
        aria-hidden="true"
      >
        →
      </span>
    </Link>
  );
}

export default CategoryCard;