import { Link } from "react-router-dom";

import {
  useLanguage,
} from "../context/LanguageContext";

function NotFound() {
  const { t } =
    useLanguage();

  return (
    <main className="page-container not-found">
      <p className="section-eyebrow">
        404
      </p>

      <h1>
        {t("notFound.title")}
      </h1>

      <p>
        {t(
          "notFound.description"
        )}
      </p>

      <Link
        to="/"
        className="button button-primary"
      >
        {t("notFound.back")}
      </Link>
    </main>
  );
}

export default NotFound;