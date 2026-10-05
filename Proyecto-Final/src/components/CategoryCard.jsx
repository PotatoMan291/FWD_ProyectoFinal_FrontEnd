import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

import Icon from "./Icon";

function CategoryCard({
  icon,
  title,
  description,
  search,
}) {
  const { t } =
    useLanguage();

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
        {t("category.explore")}

        <Icon
          name="arrowRight"
          size={16}
        />
      </span>
    </Link>
  );
}

export default CategoryCard;