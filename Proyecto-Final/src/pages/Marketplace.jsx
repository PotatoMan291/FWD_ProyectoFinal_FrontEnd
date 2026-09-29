import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import Swal from "sweetalert2";

import TourCard from "../components/TourCard";
import CompareBar from "../components/CompareBar";
import ComparisonModal from "../components/ComparisonModal";

import { getTours } from "../services/tourService";

function Marketplace() {


  const [tours, setTours] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    () =>
      searchParams.get("categoria") ||
      searchParams.get("category") ||
      ""
  );

  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [selectedCompareIds, setSelectedCompareIds] =
    useState([]);

  const [showComparison, setShowComparison] =
    useState(false);

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
          "No se pudieron cargar las experiencias turísticas."
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

    const searchValue = search
      .trim()
      .toLowerCase();

    if (searchValue) {
      result = result.filter((tour) => {
        return (
          tour.nombre
            ?.toLowerCase()
            .includes(searchValue) ||
          tour.descripcion
            ?.toLowerCase()
            .includes(searchValue) ||
          tour.ubicacion
            ?.toLowerCase()
            .includes(searchValue) ||
          tour.categoria
            ?.toLowerCase()
            .includes(searchValue)
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
        (tour) =>
          Number(tour.precio) <= Number(maxPrice)
      );
    }

    if (sort === "price-asc") {
      result.sort(
        (a, b) =>
          Number(a.precio) - Number(b.precio)
      );
    }

    if (sort === "price-desc") {
      result.sort(
        (a, b) =>
          Number(b.precio) - Number(a.precio)
      );
    }

    if (sort === "name-asc") {
      result.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
    }

    if (sort === "name-desc") {
      result.sort((a, b) =>
        b.nombre.localeCompare(a.nombre)
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

  const selectedCompareTours = useMemo(() => {
    return selectedCompareIds
      .map((id) =>
        tours.find(
          (tour) => String(tour.id) === String(id)
        )
      )
      .filter(Boolean);
  }, [selectedCompareIds, tours]);

  function handleCompare(id) {
    const stringId = String(id);

    const alreadySelected =
      selectedCompareIds.includes(stringId);

    if (alreadySelected) {
      setSelectedCompareIds((current) =>
        current.filter(
          (tourId) => tourId !== stringId
        )
      );

      return;
    }

    if (selectedCompareIds.length >= 3) {
      Swal.fire({
        icon: "info",
        title: "Límite de comparación",
        text: "Solo puedes comparar hasta 3 experiencias al mismo tiempo.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#176A4E",
      });

      return;
    }

    setSelectedCompareIds((current) => [
      ...current,
      stringId,
    ]);
  }

  function handleRemoveCompare(id) {
    setSelectedCompareIds((current) =>
      current.filter(
        (tourId) => String(tourId) !== String(id)
      )
    );
  }

  function handleClearComparison() {
    setSelectedCompareIds([]);
    setShowComparison(false);
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setLocation("");
    setMaxPrice("");
    setSort("");
  }

  return (
    <>
      <main className="marketplace-page">
        <section className="marketplace-header">
          <div className="marketplace-header-content">
            <span className="section-eyebrow">
              Explora Costa Rica
            </span>

            <h1>Encuentra tu próxima experiencia</h1>

            <p>
              Descubre tours y experiencias turísticas
              para disfrutar Costa Rica.
            </p>
          </div>
        </section>

        <section className="marketplace-content">
          <div className="marketplace-layout">
            <aside className="marketplace-filters">
              <div className="filters-header">
                <div>
                  <span className="section-eyebrow">
                    Filtrar
                  </span>

                  <h2>Encuentra lo que buscas</h2>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-filters-button"
                >
                  Limpiar
                </button>
              </div>

              <div className="filter-group">
                <label htmlFor="marketplace-search">
                  Buscar
                </label>

                <input
                  id="marketplace-search"
                  type="search"
                  placeholder="Ej. aventura, playa..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
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
                      value={item}
                      key={item}
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
                      value={item}
                      key={item}
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

                <input
                  id="price-filter"
                  type="number"
                  min="0"
                  placeholder="Ej. 50000"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(event.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <label htmlFor="sort-filter">
                  Ordenar por
                </label>

                <select
                  id="sort-filter"
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                >
                  <option value="">
                    Recomendados
                  </option>

                  <option value="price-asc">
                    Precio: menor a mayor
                  </option>

                  <option value="price-desc">
                    Precio: mayor a menor
                  </option>

                  <option value="name-asc">
                    Nombre: A-Z
                  </option>

                  <option value="name-desc">
                    Nombre: Z-A
                  </option>
                </select>
              </div>
            </aside>

            <div className="marketplace-results">
              <div className="marketplace-results-header">
                <div>
                  <span className="results-count">
                    {filteredTours.length} experiencias
                  </span>

                  <h2>
                    Experiencias disponibles
                  </h2>
                </div>

                {selectedCompareTours.length > 0 && (
                  <span className="comparison-counter">
                    {selectedCompareTours.length}{" "}
                    seleccionadas para comparar
                  </span>
                )}
              </div>

              {loading && (
                <div className="marketplace-state">
                  <p>
                    Cargando experiencias...
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="marketplace-state error">
                  <p>{error}</p>
                </div>
              )}

              {!loading &&
                !error &&
                filteredTours.length === 0 && (
                  <div className="marketplace-state">
                    <h3>
                      No encontramos experiencias
                    </h3>

                    <p>
                      Intenta cambiar los filtros de
                      búsqueda.
                    </p>

                    <button
                      type="button"
                      className="primary-button"
                      onClick={clearFilters}
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}

              {!loading &&
                !error &&
                filteredTours.length > 0 && (
                  <div className="tour-grid">
                    {filteredTours.map((tour) => (
                      <TourCard
                        key={tour.id}
                        {...tour}
                        isCompared={selectedCompareIds.includes(
                          String(tour.id)
                        )}
                        onCompare={handleCompare}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        </section>
      </main>

      <CompareBar
        selectedTours={selectedCompareTours}
        onRemove={handleRemoveCompare}
        onClear={handleClearComparison}
        onOpenComparison={() =>
          setShowComparison(true)
        }
      />

      {showComparison && (
        <ComparisonModal
          selectedTours={selectedCompareTours}
          onClose={() => setShowComparison(false)}
          onRemove={handleRemoveCompare}
          onClear={handleClearComparison}
        />
      )}
    </>
  );
}

export default Marketplace;