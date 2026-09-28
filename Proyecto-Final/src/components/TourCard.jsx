function TourCard({
  nombre,
  categoria,
  ubicacion,
  precio,
  duracion,
  personas,
  imagen,
  descripcion,
  caracteristicas = [],
  operador,
}) {
  const precioFormateado = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(precio);

  return (
    <article className="tour-card">
      <div className="tour-card-image-container">
        <img
          src={imagen}
          alt={`Imagen de ${nombre}`}
          className="tour-card-image"
        />

        <span className="tour-card-category">
          {categoria}
        </span>
      </div>

      <div className="tour-card-content">
        <div className="tour-card-location">
          <span aria-hidden="true">📍</span>
          {ubicacion}
        </div>

        <h3>{nombre}</h3>

        <p className="tour-card-description">
          {descripcion}
        </p>

        <div className="tour-card-info">
          <span>
            <strong>Duración</strong>
            {duracion}
          </span>

          <span>
            <strong>Personas</strong>
            {personas}
          </span>
        </div>

        <div className="tour-card-features">
          {caracteristicas.map((caracteristica) => (
            <span
              key={caracteristica}
              className="tour-feature"
            >
              {caracteristica}
            </span>
          ))}
        </div>

        <div className="tour-card-footer">
          <div>
            <span className="tour-card-price-label">
              Desde
            </span>

            <strong className="tour-card-price">
              {precioFormateado}
            </strong>
          </div>

          <span className="tour-card-operator">
            {operador}
          </span>
        </div>
      </div>
    </article>
  );
}

export default TourCard;