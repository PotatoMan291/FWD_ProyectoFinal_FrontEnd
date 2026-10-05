import { Link } from "react-router-dom";

import {
  useLanguage,
} from "../context/LanguageContext";

import Icon from "./Icon";

function ComparisonModal({
  selectedTours,
  onClose,
  onRemove,
  onClear,
}) {
  const { t, getTour } =
    useLanguage();

  if (
    selectedTours.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="comparison-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-modal-title"
      onClick={onClose}
    >
      <div
        className="comparison-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="comparison-modal-header">
          <div>
            <span className="section-eyebrow">
              {t(
                "comparison.eyebrow"
              )}
            </span>

            <h2 id="comparison-modal-title">
              {t(
                "comparison.title"
              )}
            </h2>

            <p>
              {t(
                "comparison.description"
              )}
            </p>
          </div>

          <button
            type="button"
            className="comparison-modal-close"
            onClick={onClose}
            aria-label={t(
              "comparison.close"
            )}
          >
            <Icon
              name="close"
              size={17}
            />
          </button>
        </div>

        <div className="comparison-modal-body">
          <div
            className={`comparison-columns comparison-columns-${selectedTours.length}`}
          >
            {selectedTours.map(
              (tour) => {
                const translated =
                  getTour(tour);

                const formattedPrice =
                  new Intl.NumberFormat(
                    "es-CR",
                    {
                      style:
                        "currency",
                      currency:
                        "CRC",
                      maximumFractionDigits: 0,
                    }
                  ).format(
                    tour.precio
                  );

                return (
                  <article
                    className="comparison-tour-column"
                    key={tour.id}
                  >
                    <div className="comparison-tour-image">
                      <img
                        src={
                          tour.imagen
                        }
                        alt={`${translated.nombre}`}
                      />

                      <span className="tour-card-category">
                        {
                          translated.categoria
                        }
                      </span>
                    </div>

                    <div className="comparison-tour-content">
                      <div className="comparison-tour-heading">
                        <h3>
                          {
                            translated.nombre
                          }
                        </h3>

                        <button
                          type="button"
                          className="comparison-remove"
                          onClick={() =>
                            onRemove(
                              tour.id
                            )
                          }
                          aria-label={`${t(
                            "tour.removeFromComparison"
                          )}: ${
                            translated.nombre
                          }`}
                        >
                          <Icon
                            name="close"
                            size={15}
                          />
                        </button>
                      </div>

                      <div className="comparison-item">
                        <span>
                          {t(
                            "comparison.location"
                          )}
                        </span>

                        <strong>
                          {
                            translated.ubicacion
                          }
                        </strong>
                      </div>

                      <div className="comparison-item">
                        <span>
                          {t(
                            "comparison.price"
                          )}
                        </span>

                        <strong>
                          {
                            formattedPrice
                          }
                        </strong>
                      </div>

                      <div className="comparison-item">
                        <span>
                          {t(
                            "comparison.duration"
                          )}
                        </span>

                        <strong>
                          {
                            translated.duracion
                          }
                        </strong>
                      </div>

                      <div className="comparison-item">
                        <span>
                          {t(
                            "comparison.capacity"
                          )}
                        </span>

                        <strong>
                          {
                            translated.personas
                          }
                        </strong>
                      </div>

                      <div className="comparison-item">
                        <span>
                          {t(
                            "comparison.operator"
                          )}
                        </span>

                        <strong>
                          {tour.operador}
                        </strong>
                      </div>

                      <div className="comparison-item comparison-description">
                        <span>
                          {t(
                            "comparison.descriptionLabel"
                          )}
                        </span>

                        <p>
                          {
                            translated.descripcion
                          }
                        </p>
                      </div>

                      <div className="comparison-item">
                        <span>
                          {t(
                            "comparison.features"
                          )}
                        </span>

                        <div className="comparison-features">
                          {translated.caracteristicas?.map(
                            (feature) => (
                              <span
                                key={
                                  feature
                                }
                                className="tour-feature-badge"
                              >
                                {
                                  feature
                                }
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/tours/${tour.id}`}
                        className="comparison-details-button"
                        onClick={onClose}
                      >
                        {t(
                          "comparison.details"
                        )}
                      </Link>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </div>

        <div className="comparison-modal-footer">
          <span>
            {selectedTours.length} / 3{" "}
            {t(
              "comparison.selected"
            )}
          </span>

          <div>
            <button
              type="button"
              className="compare-clear-button"
              onClick={onClear}
            >
              {t(
                "comparison.clear"
              )}
            </button>

            <button
              type="button"
              className="comparison-close-button"
              onClick={onClose}
            >
              {t(
                "comparison.continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonModal;