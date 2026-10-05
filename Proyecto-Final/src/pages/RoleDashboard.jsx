import { Link } from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useLanguage,
} from "../context/LanguageContext";

function RoleDashboard({
  role,
}) {
  const { user } =
    useAuth();

  const { t } =
    useLanguage();

  const roleInfo = {
    turista: {
      title: t(
        "role.touristTitle"
      ),
      description: t(
        "role.touristDescription"
      ),
    },

    operador: {
      title: t(
        "role.operatorTitle"
      ),
      description: t(
        "role.operatorDescription"
      ),
    },

    admin: {
      title: t(
        "role.adminTitle"
      ),
      description: t(
        "role.adminDescription"
      ),
    },
  };

  const currentRole =
    roleInfo[role] ||
    roleInfo.turista;

  return (
    <main className="auth-page">
      <section
        className="auth-card"
        aria-labelledby="role-dashboard-title"
      >
        <div className="auth-header">
          <p className="section-eyebrow">
            PURAVIDA TRIPS
          </p>

          <h1 id="role-dashboard-title">
            {currentRole.title}
          </h1>

          <p>
            {t("role.greeting")},{" "}
            {user?.nombre}.
          </p>

          <p>
            {currentRole.description}
          </p>
        </div>

        <div className="auth-demo">
          <p>
            <strong>
              {t(
                "role.underConstruction"
              )}
            </strong>
          </p>

          <span>
            {t(
              "role.moduleDescription"
            )}
          </span>
        </div>

        <Link
          to="/"
          className="button button-primary"
        >
          {t("role.backHome")}
        </Link>
      </section>
    </main>
  );
}

export default RoleDashboard;