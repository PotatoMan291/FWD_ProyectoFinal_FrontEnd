import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SectionTitle from "../components/SectionTitle";
import TourCard from "../components/TourCard";
import { getTours } from "../services/tourService";

function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("categoria") || ""
  );

  const [location, setLocation] = useState(
    searchParams.get("ubicacion") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("precio") || ""
  );

  const [sort, setSort] = useState("");

  useEffect(() => {
    async function loadTours() {
      try {
        setLoading(true);
        setError("");

        const data = await getTours();

        setTours(data);
      } catch (err) {
        console.error(err);
        setError(
          "No se pudieron cargar las experiencias. Verifica que JSON Server esté ejecutándose."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        tours
          .map((tour) => tour.categoria)
          .filter(Boolean)
      ),
    ];
  }, [tours]);

  const locations = useMemo(() => {
    return [
      ...new Set(
        tours
          .map((tour) => tour.ubicacion)
          .filter(Boolean)
      ),
    ];
  }, [tours]);

  const filteredTours = useMemo(() => {
    let result = [...tours];

    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (normalizedSearch) {
      result = result.filter((tour) => {
        const searchableText = [
          tour.nombre,
          tour.descripcion,
          tour.categoria,
          tour.ubicacion,
          tour.operador,
          ...(tour.caracteristicas || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          normalizedSearch
        );
      });
    }

    if (category) {
      result = result.filter(
        (tour) => tour.categoria === category
      );
    }

    if (location) {
      result = result.filter(
        (tour) => tour.ubicacion === location
      );
    }

    if (maxPrice) {
      result = result.filter(
        (tour) => tour.precio <= Number(maxPrice)
      );
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.precio - b.precio);
    }

    if (sort === "price-desc") {
      result.sort((a, b) => b.precio - a.precio);
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
    }

    return result;
  }, [
    tours,
    search,
    category,
    location,
    maxPrice,
    sort,
  ]);

  useEffect(() => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (category) {
      params.categoria = category;
    }

    if (location) {
      params.ubicacion = location;
    }

    if (maxPrice) {
      params.precio = maxPrice;
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [
    search,
    category,
    location,
    maxPrice,
    setSearchParams,
  ]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setLocation("");
    setMaxPrice("");
    setSort("");
  }

  return (
    <main className="marketplace-page">
      <section className="marketplace-header">
        <div className="content-container">
          <SectionTitle
            eyebrow="MARKETPLACE"
            title="Encuentra tu próxima experiencia"
            description="Explora tours y experiencias turísticas en diferentes destinos de Costa Rica."
          />
        </div>
      </section>

      <section className="marketplace-section">
        <div className="content-container">
          <div className="marketplace-layout">
            <aside
              className="filters-panel"
              aria-label="Filtros de búsqueda"
            >
              <div className="filters-header">
                <h2>Filtrar experiencias</h2>

                <button
                  type="button"
                  className="clear-filters"
                  onClick={clearFilters}
                >
                  Limpiar
                </button>
              </div>

              <div className="filter-group">
                <label htmlFor="tour-search">
                  Buscar
                </label>

                <input
                  id="tour-search"
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="¿Qué quieres hacer?"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="category-filter">
                  Categoría
                </label>

                <select
                  id="category-filter"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option value="">
                    Todas las categorías
                  </option>

                  {categories.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="location-filter">
                  Ubicación
                </label>

                <select
                  id="location-filter"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                >
                  <option value="">
                    Todas las ubicaciones
                  </option>

                  {locations.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="price-filter">
                  Precio máximo
                </label>

                <select
                  id="price-filter"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(event.target.value)
                  }
                >
                  <option value="">
                    Cualquier precio
                  </option>

                  <option value="20000">
                    Hasta ₡20.000
                  </option>

                  <option value="30000">
                    Hasta ₡30.000
                  </option>

                  <option value="40000">
                    Hasta ₡40.000
                  </option>

                  <option value="50000">
                    Hasta ₡50.000
                  </option>

                  <option value="60000">
                    Hasta ₡60.000
                  </option>
                </select>
              </div>
            </aside>

            <div className="marketplace-results">
              <div className="marketplace-toolbar">
                <div>
                  <strong>
                    {filteredTours.length}
                  </strong>{" "}
                  experiencias encontradas
                </div>

                <div className="sort-control">
                  <label htmlFor="sort">
                    Ordenar:
                  </label>

                  <select
                    id="sort"
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value)
                    }
                  >
                    <option value="">
                      Relevancia
                    </option>

                    <option value="price-asc">
                      Precio: menor a mayor
                    </option>

                    <option value="price-desc">
                      Precio: mayor a menor
                    </option>

                    <option value="name">
                      Nombre
                    </option>
                  </select>
                </div>
              </div>

              {loading && (
                <div className="marketplace-state">
                  <div
                    className="loading-spinner"
                    aria-hidden="true"
                  />

                  <p>
                    Cargando experiencias...
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="marketplace-state error-state">
                  <span
                    className="state-icon"
                    aria-hidden="true"
                  >
                    !
                  </span>

                  <h2>
                    No pudimos cargar los tours
                  </h2>

                  <p>{error}</p>
                </div>
              )}

              {!loading &&
                !error &&
                filteredTours.length > 0 && (
                  <div className="tours-grid">
                    {filteredTours.map((tour) => (
                      <TourCard
                        key={tour.id}
                        {...tour}
                      />
                    ))}
                  </div>
                )}

              {!loading &&
                !error &&
                filteredTours.length === 0 && (
                  <div className="marketplace-state empty-state">
                    <span
                      className="state-icon"
                      aria-hidden="true"
                    >
                      ?
                    </span>

                    <h2>
                      No encontramos experiencias
                    </h2>

                    <p>
                      Intenta modificar los filtros o
                      realizar una búsqueda diferente.
                    </p>

                    <button
                      type="button"
                      className="clear-filters-button"
                      onClick={clearFilters}
                    >
                      Ver todas las experiencias
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Marketplace;