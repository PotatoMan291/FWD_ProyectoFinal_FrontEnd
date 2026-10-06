import { createPortal } from "react-dom";

import Icon from "./Icon";

function CompareBar({
  selectedTours,
  onRemove,
  onClear,
  onOpenComparison,
}) {
  if (selectedTours.length === 0) {
    return null;
  }

  const canCompare = selectedTours.length >= 2;

  const content = (
    <aside
      className="compare-bar"
      aria-label="Comparación de experiencias"
    >
      <div className="compare-bar-content">
        <div className="compare-bar-info">
          <strong>Comparar experiencias</strong>
          <span>
            {selectedTours.length} de 3 seleccionadas
          </span>
        </div>

        <div className="compare-bar-tours">
          {selectedTours.map((tour) => (
            <div
              className="compare-mini-card"
              key={tour.id}
            >
              <img src={tour.imagen} alt="" />

              <span>{tour.nombre}</span>

              <button
                type="button"
                onClick={() => onRemove(tour.id)}
                aria-label={`Quitar ${tour.nombre} de la comparación`}
              >
                <Icon name="close" size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="compare-bar-actions">
          <button
            type="button"
            className="compare-clear-button"
            onClick={onClear}
          >
            Limpiar
          </button>

          <button
            type="button"
            className="compare-main-button"
            onClick={onOpenComparison}
            disabled={!canCompare}
            aria-disabled={!canCompare}
          >
            Comparar
          </button>
        </div>
      </div>
    </aside>
  );

  return createPortal(content, document.body);
}

export default CompareBar;
