import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useLanguage,
} from "../context/LanguageContext";

import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsUrl,
  getWeatherByLocation,
  getWeatherDescription,
} from "../services/externalService";

import {
  getTourById,
} from "../services/tourService";

import Icon from "../components/Icon";

function formatPrice(price) {
  return new Intl.NumberFormat(
    "es-CR",
    {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }
  ).format(price);
}

function TourDetail() {
  const { id } =
    useParams();

  const { t, getTour } =
    useLanguage();

  const [tour, setTour] =
    useState(null);

  const [weather, setWeather] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [weatherLoading, setWeatherLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadTour() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTourById(id);

        setTour(data);
      } catch (requestError) {
        console.error(
          "Error al cargar el tour:",
          requestError
        );

        setError(
          t("tour.notFoundDescription")
        );
      } finally {
        setLoading(false);
      }
    }

    loadTour();
  }, [id, t]);

  useEffect(() => {
    if (!tour?.ubicacion) {
      return;
    }

    async function loadWeather() {
      try {
        setWeatherLoading(true);

        const data =
          await getWeatherByLocation(
            tour.ubicacion
          );

        setWeather(data);
      } catch (weatherError) {
        console.error(
          "Error al cargar el clima:",
          weatherError
        );

        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    }

    loadWeather();
  }, [tour]);

  if (loading) {
    return (
      <main className="tour-detail-page">
        <div className="content-container">
          <div className="tour-detail-state">
            <p>
              {t("tour.loading")}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !tour) {
    return (
      <main className="tour-detail-page">
        <div className="content-container">
          <div className="tour-detail-state tour-detail-state-error">
            <h1>
              {t("tour.notFound")}
            </h1>

            <p>
              {error ||
                t(
                  "tour.notFoundDescription"
                )}
            </p>

            <Link
              className="tour-detail-back-button"
              to="/tours"
            >
              {t(
                "tour.backToCatalog"
              )}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const translatedTour =
    getTour(tour);

  const weatherCode =
    weather?.current?.weather_code;

  const temperature =
    weather?.current
      ?.temperature_2m;

  return (
    <main className="tour-detail-page">
      <div className="content-container">
        <Link
          className="tour-detail-back-link"
          to="/tours"
        >
          <Icon
            name="arrowLeft"
            size={17}
          />

          {t(
            "tour.backToCatalog"
          )}
        </Link>

        <section
          className="tour-detail-hero"
          aria-labelledby="tour-detail-title"
        >
          <div className="tour-detail-image-wrapper">
            <img
              className="tour-detail-image"
              src={tour.imagen}
              alt={`${translatedTour.nombre}`}
            />
          </div>

          <div className="tour-detail-summary">
            <span className="tour-detail-category">
              {
                translatedTour.categoria
              }
            </span>

            <h1 id="tour-detail-title">
              {translatedTour.nombre}
            </h1>

            <p className="tour-detail-location">
              <Icon
                name="mapPin"
                size={17}
              />

              {translatedTour.ubicacion},{" "}
              Costa Rica
            </p>

            <p className="tour-detail-description">
              {
                translatedTour.descripcion
              }
            </p>

            <div className="tour-detail-price-block">
              <span>
                {t("tour.from")}
              </span>

              <strong>
                {formatPrice(
                  tour.precio
                )}
              </strong>

              <small>
                {t(
                  "tour.perPerson"
                )}
              </small>
            </div>

            <div className="tour-detail-actions">
              <a
                className="tour-detail-primary-button"
                href={getGoogleMapsUrl(
                  tour.ubicacion
                )}
                target="_blank"
                rel="noreferrer"
              >
                {t("tour.maps")}

                <Icon
                  name="external"
                  size={16}
                />
              </a>

              <Link
                className="tour-detail-secondary-button"
                to="/tours"
              >
                {t(
                  "tour.keepExploring"
                )}
              </Link>
            </div>
          </div>
        </section>

        <section
          className="tour-detail-info-grid"
          aria-label={t(
            "tour.details"
          )}
        >
          <article className="tour-detail-info-card">
            <span className="tour-detail-info-label">
              {t(
                "tour.duration"
              )}
            </span>

            <strong>
              {
                translatedTour.duracion
              }
            </strong>
          </article>

          <article className="tour-detail-info-card">
            <span className="tour-detail-info-label">
              {t(
                "tour.capacity"
              )}
            </span>

            <strong>
              {
                translatedTour.personas
              }
            </strong>
          </article>

          <article className="tour-detail-info-card">
            <span className="tour-detail-info-label">
              {t(
                "tour.operator"
              )}
            </span>

            <strong>
              {tour.operador}
            </strong>
          </article>
        </section>

        <section className="tour-detail-content-grid">
          <article className="tour-detail-panel">
            <span className="section-eyebrow">
              {t("tour.includes")}
            </span>

            <h2>
              {t(
                "tour.featuresTitle"
              )}
            </h2>

            <ul className="tour-detail-features">
              {translatedTour.caracteristicas?.map(
                (feature) => (
                  <li key={feature}>
                    <span aria-hidden="true">
                      <Icon
                        name="check"
                        size={14}
                      />
                    </span>

                    {feature}
                  </li>
                )
              )}
            </ul>
          </article>

          <article className="tour-detail-panel tour-detail-weather-panel">
            <span className="section-eyebrow">
              {t(
                "tour.destination"
              )}
            </span>

            <h2>
              {t(
                "tour.currentWeather"
              )}
            </h2>

            {weatherLoading ? (
              <p className="tour-detail-muted">
                {t(
                  "tour.checkingWeather"
                )}
              </p>
            ) : weather ? (
              <div className="tour-detail-weather">
                <div className="tour-detail-temperature">
                  {Math.round(
                    temperature
                  )}
                  °C
                </div>

                <div>
                  <strong>
                    {getWeatherDescription(
                      weatherCode
                    )}
                  </strong>

                  <p>
                    {t(
                      "tour.currentConditions"
                    )}{" "}
                    {
                      translatedTour.ubicacion
                    }
                    .
                  </p>
                </div>
              </div>
            ) : (
              <p className="tour-detail-muted">
                {t(
                  "tour.weatherError"
                )}
              </p>
            )}
          </article>
        </section>

        <section
          className="tour-detail-map-section"
          aria-labelledby="map-title"
        >
          <div className="section-heading">
            <span className="section-eyebrow">
              {t("tour.location")}
            </span>

            <h2 id="map-title">
              {t("tour.where")}
            </h2>

            <p className="section-description">
              {t(
                "tour.mapDescription"
              )}
            </p>
          </div>

          <div className="tour-detail-map-wrapper">
            <iframe
              title={`Map ${translatedTour.ubicacion}`}
              src={getGoogleMapsEmbedUrl(
                tour.ubicacion
              )}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default TourDetail;