import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import Swal from "sweetalert2";

import {
  useLanguage,
} from "../context/LanguageContext";

import TourCard from "../components/TourCard";
import CompareBar from "../components/CompareBar";
import ComparisonModal from "../components/ComparisonModal";

import {
  getTours,
} from "../services/tourService";

function Marketplace() {
  const {
    t,
    getTour,
  } = useLanguage();

  const [tours, setTours] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchParams] =
    useSearchParams();

  const [search, setSearch] =
    useState(
      () =>
        searchParams.get(
          "search"
        ) || ""
    );

  const [category, setCategory] =
    useState(
      () =>
        searchParams.get(
          "categoria"
        ) ||
        searchParams.get(
          "category"
        ) ||
        ""
    );

  const [location, setLocation] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [sort, setSort] =
    useState("");

  const [
    selectedCompareIds,
    setSelectedCompareIds,
  ] = useState([]);

  const [
    showComparison,
    setShowComparison,
  ] = useState(false);

  useEffect(() => {
    async function loadTours() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTours();

        setTours(data);
      } catch (err) {
        console.error(err);

        setError(
          t("marketplace.error")
        );
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, [t]);

  const categories =
    useMemo(() => {
      return [
        ...new Set(
          tours
            .map(
              (tour) =>
                tour.categoria
            )
            .filter(Boolean)
        ),
      ];
    }, [tours]);

  const locations =
    useMemo(() => {
      return [
        ...new Set(
          tours
            .map(
              (tour) =>
                tour.ubicacion
            )
            .filter(Boolean)
        ),
      ];
    }, [tours]);

  const filteredTours =
    useMemo(() => {
      let result = [...tours];

      const searchValue =
        search
          .trim()
          .toLowerCase();

      if (searchValue) {
        result = result.filter(
          (tour) => {
            const translated =
              getTour(tour);

            return [
              tour.nombre,
              tour.descripcion,
              tour.ubicacion,
              tour.categoria,
              translated.nombre,
              translated.descripcion,
              translated.ubicacion,
              translated.categoria,
            ].some((value) =>
              value
                ?.toLowerCase()
                .includes(
                  searchValue
                )
            );
          }
        );
      }

      if (category) {
        result =
          result.filter(
            (tour) =>
              tour.categoria ===
              category
          );
      }

      if (location) {
        result =
          result.filter(
            (tour) =>
              tour.ubicacion ===
              location
          );
      }

      if (maxPrice) {
        result =
          result.filter(
            (tour) =>
              Number(
                tour.precio
              ) <=
              Number(maxPrice)
          );
      }

      if (sort === "price-asc") {
        result.sort(
          (a, b) =>
            Number(a.precio) -
            Number(b.precio)
        );
      }

      if (sort === "price-desc") {
        result.sort(
          (a, b) =>
            Number(b.precio) -
            Number(a.precio)
        );
      }

      if (sort === "name-asc") {
        result.sort(
          (a, b) =>
            getTour(
              a
            ).nombre.localeCompare(
              getTour(b).nombre
            )
        );
      }

      if (sort === "name-desc") {
        result.sort(
          (a, b) =>
            getTour(
              b
            ).nombre.localeCompare(
              getTour(a).nombre
            )
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
      getTour,
    ]);

  const selectedCompareTours =
    useMemo(() => {
      return selectedCompareIds
        .map((id) =>
          tours.find(
            (tour) =>
              String(
                tour.id
              ) ===
              String(id)
          )
        )
        .filter(Boolean);
    }, [
      selectedCompareIds,
      tours,
    ]);

  function handleCompare(id) {
    const stringId =
      String(id);

    const alreadySelected =
      selectedCompareIds.includes(
        stringId
      );

    if (alreadySelected) {
      setSelectedCompareIds(
        (current) =>
          current.filter(
            (tourId) =>
              tourId !==
              stringId
          )
      );

      return;
    }

    if (
      selectedCompareIds.length >=
      3
    ) {
      Swal.fire({
        icon: "info",
        title: t(
          "marketplace.compareLimitTitle"
        ),
        text: t(
          "marketplace.compareLimitText"
        ),
        confirmButtonText: t(
          "marketplace.understood"
        ),
        confirmButtonColor:
          "#176A4E",
      });

      return;
    }

    setSelectedCompareIds(
      (current) => [
        ...current,
        stringId,
      ]
    );
  }

  function handleRemoveCompare(
    id
  ) {
    setSelectedCompareIds(
      (current) =>
        current.filter(
          (tourId) =>
            String(tourId) !==
            String(id)
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

  const getCategoryLabel = (
    categoryName
  ) => {
    const map = {
      Naturaleza:
        "home.categories.nature.title",
      Aventura:
        "home.categories.adventure.title",
      Playa:
        "home.categories.beach.title",
      Cultura:
        "home.categories.culture.title",
    };

    return map[categoryName]
      ? t(map[categoryName])
      : categoryName;
  };

  const getLocationLabel = (
    locationName
  ) => {
    const locationMap = {
      "San José": "San José",
      Guanacaste:
        "Guanacaste",
      Puntarenas:
        "Puntarenas",
      Alajuela:
        "Alajuela",
      Cartago:
        "Cartago",
      Limón: "Limón",
    };

    return locationMap[
      locationName
    ] || locationName;
  };

  return (
    <>
      <main className="marketplace-page">
        <section className="marketplace-header">
          <div className="marketplace-header-content">
            <span className="section-eyebrow">
              {t(
                "marketplace.eyebrow"
              )}
            </span>

            <h1>
              {t(
                "marketplace.title"
              )}
            </h1>

            <p>
              {t(
                "marketplace.description"
              )}
            </p>
          </div>
        </section>

        <section className="marketplace-content">
          <div className="marketplace-layout">
            <aside className="marketplace-filters">
              <div className="filters-header">
                <div>
                  <span className="section-eyebrow">
                    {t(
                      "marketplace.filterEyebrow"
                    )}
                  </span>

                  <h2>
                    {t(
                      "marketplace.filterTitle"
                    )}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="clear-filters-button"
                >
                  {t(
                    "marketplace.clear"
                  )}
                </button>
              </div>

              <div className="filter-group">
                <label htmlFor="marketplace-search">
                  {t(
                    "marketplace.search"
                  )}
                </label>

                <input
                  id="marketplace-search"
                  type="search"
                  placeholder={t(
                    "marketplace.searchPlaceholder"
                  )}
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="filter-group">
                <label htmlFor="category-filter">
                  {t(
                    "marketplace.category"
                  )}
                </label>

                <select
                  id="category-filter"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    {t(
                      "marketplace.allCategories"
                    )}
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        value={item}
                        key={item}
                      >
                        {getCategoryLabel(
                          item
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="location-filter">
                  {t(
                    "marketplace.location"
                  )}
                </label>

                <select
                  id="location-filter"
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    {t(
                      "marketplace.allLocations"
                    )}
                  </option>

                  {locations.map(
                    (item) => (
                      <option
                        value={item}
                        key={item}
                      >
                        {getLocationLabel(
                          item
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="price-filter">
                  {t(
                    "marketplace.maxPrice"
                  )}
                </label>

                <input
                  id="price-filter"
                  type="number"
                  min="0"
                  placeholder={t(
                    "marketplace.pricePlaceholder"
                  )}
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="filter-group">
                <label htmlFor="sort-filter">
                  {t(
                    "marketplace.sort"
                  )}
                </label>

                <select
                  id="sort-filter"
                  value={sort}
                  onChange={(event) =>
                    setSort(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    {t(
                      "marketplace.recommended"
                    )}
                  </option>

                  <option value="price-asc">
                    {t(
                      "marketplace.priceAsc"
                    )}
                  </option>

                  <option value="price-desc">
                    {t(
                      "marketplace.priceDesc"
                    )}
                  </option>

                  <option value="name-asc">
                    {t(
                      "marketplace.nameAsc"
                    )}
                  </option>

                  <option value="name-desc">
                    {t(
                      "marketplace.nameDesc"
                    )}
                  </option>
                </select>
              </div>
            </aside>

            <div className="marketplace-results">
              <div className="marketplace-results-header">
                <div>
                  <span className="results-count">
                    {
                      filteredTours.length
                    }{" "}
                    {t(
                      "marketplace.results"
                    )}
                  </span>

                  <h2>
                    {t(
                      "marketplace.available"
                    )}
                  </h2>
                </div>

                {selectedCompareTours.length >
                  0 && (
                  <span className="comparison-counter">
                    {
                      selectedCompareTours.length
                    }{" "}
                    {t(
                      "marketplace.selected"
                    )}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="marketplace-state">
                  <p>
                    {t(
                      "marketplace.loading"
                    )}
                  </p>
                </div>
              ) : error ? (
                <div className="marketplace-state marketplace-state-error">
                  <p>{error}</p>
                </div>
              ) : filteredTours.length ===
                0 ? (
                <div className="marketplace-state">
                  <p>
                    {t(
                      "marketplace.empty"
                    )}
                  </p>

                  <button
                    type="button"
                    className="clear-filters-button"
                    onClick={
                      clearFilters
                    }
                  >
                    {t(
                      "marketplace.clearFilters"
                    )}
                  </button>
                </div>
              ) : (
                <div className="tours-grid">
                  {filteredTours.map(
                    (tour) => (
                      <TourCard
                        key={tour.id}
                        {...tour}
                        isCompared={selectedCompareIds.includes(
                          String(
                            tour.id
                          )
                        )}
                        onCompare={
                          handleCompare
                        }
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <CompareBar
        selectedTours={
          selectedCompareTours
        }
        onRemove={
          handleRemoveCompare
        }
        onClear={
          handleClearComparison
        }
        onOpenComparison={() =>
          setShowComparison(true)
        }
      />

      {showComparison && (
        <ComparisonModal
          selectedTours={
            selectedCompareTours
          }
          onClose={() =>
            setShowComparison(false)
          }
          onRemove={
            handleRemoveCompare
          }
          onClear={
            handleClearComparison
          }
        />
      )}
    </>
  );
}

export default Marketplace;