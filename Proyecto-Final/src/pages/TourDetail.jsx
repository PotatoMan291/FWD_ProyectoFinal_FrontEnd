import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsUrl,
  getWeatherByLocation,
  getWeatherDescription,
} from "../services/externalService";

import { getTourById } from "../services/tourService";

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
  const { id } = useParams();

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
          "No se pudo cargar la información del tour."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTour();
  }, [id]);

  useEffect(() => {
    if (!tour?.ubicacion) {
      return;
    }

    async function loadWeather() {
      try {
        setWeatherLoading(true);

        const data =
          await getWeatherByLocation(tour);

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
              Cargando información del tour...
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
            <h1>Tour no encontrado</h1>

            <p>
              {error ||
                "No encontramos la experiencia que estás buscando."}
            </p>

            <Link
              className="tour-detail-back-button"
              to="/tours"
            >
              Volver al catálogo
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const weatherCode =
    weather?.current?.weather_code;

  const temperature =
    weather?.current?.temperature_2m;

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

          Volver al catálogo
        </Link>

        <section
          className="tour-detail-hero"
          aria-labelledby="tour-detail-title"
        >
          <div className="tour-detail-image-wrapper">
            <img
              className="tour-detail-image"
              src={tour.imagen}
              alt={`Paisaje relacionado con ${tour.nombre}`}
            />
          </div>

          <div className="tour-detail-summary">
            <span className="tour-detail-category">
              {tour.categoria}
            </span>

            <h1 id="tour-detail-title">
              {tour.nombre}
            </h1>

            <p className="tour-detail-location">
              <Icon
                name="mapPin"
                size={17}
              />

              {tour.destino || tour.ubicacion}, Costa Rica
            </p>

            <p className="tour-detail-description">
              {tour.descripcion}
            </p>

            <div className="tour-detail-price-block">
              <span>Desde</span>

              <strong>
                {formatPrice(
                  tour.precio
                )}
              </strong>

              <small>
                por persona
              </small>
            </div>

            <div className="tour-detail-actions">
              <a
                className="tour-detail-primary-button"
                href={getGoogleMapsUrl(tour)}
                target="_blank"
                rel="noreferrer"
              >
                Ver ubicación en Google Maps

                <Icon
                  name="external"
                  size={16}
                />
              </a>

              <Link
                className="tour-detail-secondary-button"
                to="/tours"
              >
                Seguir explorando
              </Link>
            </div>
          </div>
        </section>

        {tour.video && (
          <section className="tour-detail-video-section" aria-label="Video del tour">
            <div className="tour-detail-video-header">
              <span className="section-eyebrow">PURAVIDA TRIPS</span>
              <h2>Conoce la experiencia</h2>
            </div>
            <video className="tour-detail-video" controls preload="metadata">
              <source src={tour.video} type="video/mp4" />
              Tu navegador no admite la reproducción de video.
            </video>
          </section>
        )}

        <section
          className="tour-detail-info-grid"
          aria-label="Información del tour"
        >
          <article className="tour-detail-info-card">
            <span className="tour-detail-info-label">
              Duración
            </span>

            <strong>
              {tour.duracion}
            </strong>
          </article>

          <article className="tour-detail-info-card">
            <span className="tour-detail-info-label">
              Capacidad
            </span>

            <strong>
              {tour.personas}
            </strong>
          </article>

          <article className="tour-detail-info-card">
            <span className="tour-detail-info-label">
              Operador
            </span>

            <strong>
              {tour.operador}
            </strong>
          </article>
        </section>

        <section className="tour-detail-content-grid">
          <article className="tour-detail-panel">
            <span className="section-eyebrow">
              Incluye
            </span>

            <h2>
              Características de la experiencia
            </h2>

            <ul className="tour-detail-features">
              {tour.caracteristicas?.map(
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
              Información del destino
            </span>

            <h2>
              Clima actual
            </h2>

            {weatherLoading ? (
              <p className="tour-detail-muted">
                Consultando el clima...
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
                    Condiciones actuales en{" "}
                    {tour.ubicacion}.
                  </p>
                </div>
              </div>
            ) : (
              <p className="tour-detail-muted">
                No fue posible consultar el clima
                en este momento.
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
              Ubicación
            </span>

            <h2 id="map-title">
              ¿Dónde se realiza?
            </h2>

            <p className="section-description">
              Consulta la ubicación del destino y abre Google Maps para explorar el lugar del tour.
            </p>
          </div>

          <div className="tour-detail-map-wrapper">
            <iframe
              title={`Mapa de ${tour.destino || tour.ubicacion}`}
              src={getGoogleMapsEmbedUrl(tour)}
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