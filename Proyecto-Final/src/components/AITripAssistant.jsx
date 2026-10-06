import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { getTourRecommendations } from "../services/aiService";
import { getTours } from "../services/tourService";
import Button from "./Button";

function AITripAssistant() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (!preferences.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tours = await getTours();

      const data = await getTourRecommendations({
        user,
        preferences,
        tours,
        language,
      });

      const recommendations = (data?.recommendations || []).map(
        (recommendation) => {
          const tour = tours.find(
            (item) =>
              String(item.id) === String(recommendation.id)
          );

          return {
            ...recommendation,
            tour,
          };
        }
      );

      setResult({
        ...data,
        recommendations,
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const recommendations = result?.recommendations || [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat(
      language === "en" ? "en-US" : "es-CR",
      {
        style: "currency",
        currency: "CRC",
        maximumFractionDigits: 0,
      }
    ).format(Number(price) || 0);
  };

  return (
    <section className="dashboard-card ai-assistant-card">
      <div className="dashboard-card-header">
        <div>
          <span className="section-eyebrow">n8n + AI</span>

          <h2>{t("dashboard.aiTitle")}</h2>

          <p>{t("dashboard.aiDescription")}</p>
        </div>
      </div>

      <form
        className="dashboard-ai-form"
        onSubmit={submit}
      >
        <label htmlFor="ai-preferences">
          {t("dashboard.preferences")}
        </label>

        <textarea
          id="ai-preferences"
          rows="3"
          value={preferences}
          onChange={(event) =>
            setPreferences(event.target.value)
          }
          placeholder={t("dashboard.aiPlaceholder")}
        />

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? t("dashboard.aiLoading")
            : t("dashboard.askAI")}
        </Button>
      </form>

      {error && (
        <p className="dashboard-error">
          {error}
        </p>
      )}

      {result?.message && (
        <p className="dashboard-ai-message">
          {result.message}
        </p>
      )}

      {recommendations.length > 0 && (
        <div className="ai-recommendations">
          {recommendations.map((item) => {
            const tour = item.tour;

            return (
              <article
                key={item.id}
                className="ai-recommendation"
              >
                {tour?.imagen && (
                  <img
                    src={tour.imagen}
                    alt={tour.nombre}
                    className="ai-recommendation-image"
                  />
                )}

                <div className="ai-recommendation-content">
                  <span className="ai-recommendation-category">
                    {tour?.categoria || "Tour"}
                  </span>

                  <h3>
                    {tour?.nombre ||
                      item.name ||
                      item.nombre ||
                      `Tour ${item.id}`}
                  </h3>

                  {tour?.ubicacion && (
                    <div className="ai-recommendation-location">
                      {tour.ubicacion}
                    </div>
                  )}

                  <div className="ai-recommendation-meta">
                    {tour?.precio !== undefined && (
                      <span>
                        <strong>
                          {formatPrice(tour.precio)}
                        </strong>
                      </span>
                    )}

                    {tour?.duracion && (
                      <span>
                        {tour.duracion}
                      </span>
                    )}

                    {tour?.personas && (
                      <span>
                        {tour.personas}
                      </span>
                    )}
                  </div>

                  {tour?.descripcion && (
                    <p className="ai-recommendation-description">
                      {tour.descripcion}
                    </p>
                  )}

                  {tour?.caracteristicas?.length > 0 && (
                    <div className="ai-recommendation-features">
                      {tour.caracteristicas
                        .slice(0, 3)
                        .map((feature) => (
                          <span key={feature}>
                            {feature}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="ai-recommendation-reason">
                    <strong>
                      {language === "en"
                        ? "Why this tour?"
                        : "¿Por qué este tour?"}
                    </strong>

                    <p>
                      {item.reason ||
                        item.motivo ||
                        item.description ||
                        (language === "en"
                          ? "Recommended based on your preferences."
                          : "Recomendado según tus preferencias.")}
                    </p>
                  </div>

                  {tour?.id && (
                    <Link
                      to={`/tours/${tour.id}`}
                      className="ai-recommendation-button"
                    >
                      {t("tour.details")}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {result &&
        recommendations.length === 0 && (
          <p className="dashboard-ai-message">
            {t("dashboard.noRecommendations")}
          </p>
        )}
    </section>
  );
}

export default AITripAssistant;