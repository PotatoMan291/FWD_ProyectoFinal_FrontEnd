import { Link } from "react-router-dom";

function ComparisonModal({
  selectedTours,
  onClose,
  onRemove,
  onClear,
}) {
  if (selectedTours.length === 0) {
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
        onClick={(event) => event.stopPropagation()}
      >
        <div className="comparison-modal-header">
          <div>
            <span className="section-eyebrow">
              Comparación
            </span>

            <h2 id="comparison-modal-title">
              Compara tus experiencias
            </h2>

            <p>
              Revisa las características de cada tour antes
              de elegir tu experiencia.
            </p>
          </div>

          <button
            type="button"
            className="comparison-modal-close"
            onClick={onClose}
            aria-label="Cerrar comparación"
          >
            ×
          </button>
        </div>

        <div className="comparison-modal-body">
          <div
            className={`comparison-columns comparison-columns-${selectedTours.length}`}
          >
            {selectedTours.map((tour) => {
              const formattedPrice = new Intl.NumberFormat(
                "es-CR",
                {
                  style: "currency",
                  currency: "CRC",
                  maximumFractionDigits: 0,
                }
              ).format(tour.precio);

              return (
                <article
                  className="comparison-tour-column"
                  key={tour.id}
                >
                  <div className="comparison-tour-image">
                    <img
                      src={tour.imagen}
                      alt={`Experiencia turística: ${tour.nombre}`}
                    />

                    <span className="tour-card-category">
                      {tour.categoria}
                    </span>
                  </div>

                  <div className="comparison-tour-content">
                    <div className="comparison-tour-heading">
                      <h3>{tour.nombre}</h3>

                      <button
                        type="button"
                        className="comparison-remove"
                        onClick={() => onRemove(tour.id)}
                        aria-label={`Quitar ${tour.nombre} de la comparación`}
                      >
                        ×
                      </button>
                    </div>

                    <div className="comparison-item">
                      <span>Ubicación</span>
                      <strong>{tour.ubicacion}</strong>
                    </div>

                    <div className="comparison-item">
                      <span>Precio</span>
                      <strong>{formattedPrice}</strong>
                    </div>

                    <div className="comparison-item">
                      <span>Duración</span>
                      <strong>{tour.duracion}</strong>
                    </div>

                    <div className="comparison-item">
                      <span>Capacidad</span>
                      <strong>
                        Hasta {tour.personas} personas
                      </strong>
                    </div>

                    <div className="comparison-item">
                      <span>Operador</span>
                      <strong>{tour.operador}</strong>
                    </div>

                    <div className="comparison-item comparison-description">
                      <span>Descripción</span>
                      <p>{tour.descripcion}</p>
                    </div>

                    <div className="comparison-item">
                      <span>Características</span>

                      <div className="comparison-features">
                        {tour.caracteristicas?.map(
                          (caracteristica) => (
                            <span
                              key={caracteristica}
                              className="tour-feature-badge"
                            >
                              {caracteristica}
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
                      Ver detalles del tour
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="comparison-modal-footer">
          <span>
            {selectedTours.length} de 3 experiencias
            seleccionadas
          </span>

          <div>
            <button
              type="button"
              className="compare-clear-button"
              onClick={onClear}
            >
              Limpiar comparación
            </button>

            <button
              type="button"
              className="comparison-close-button"
              onClick={onClose}
            >
              Seguir explorando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonModal;