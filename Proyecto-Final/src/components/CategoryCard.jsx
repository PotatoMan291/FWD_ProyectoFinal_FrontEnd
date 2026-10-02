import { Link } from "react-router-dom";
import Icon from "./Icon";

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
        <Icon
          name={icon}
          size={25}
        />
      </span>

      <h3>{title}</h3>

      <p>{description}</p>

      <span className="category-card-link">
        Explorar
        <Icon
          name="arrowRight"
          size={16}
        />
      </span>
    </Link>
  );
}

export default CategoryCard;