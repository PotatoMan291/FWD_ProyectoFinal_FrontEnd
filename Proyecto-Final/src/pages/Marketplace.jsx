import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useLanguage } from "../context/LanguageContext";
import TourCard from "../components/TourCard";
import CompareBar from "../components/CompareBar";
import ComparisonModal from "../components/ComparisonModal";
import { getTours } from "../services/tourService";
function Marketplace() {
  const { t } = useLanguage();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [category, setCategory] = useState(
    () => searchParams.get("categoria") || searchParams.get("category") || "",
  );
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  useEffect(() => {
    getTours()
      .then(setTours)
      .catch((err) => {
        console.error(err);
        setError(t("marketplace.emptyText"));
      })
      .finally(() => setLoading(false));
  }, [t]);
  const categories = useMemo(
    () => [...new Set(tours.map((tour) => tour.categoria).filter(Boolean))],
    [tours],
  );
  const locations = useMemo(
    () => [...new Set(tours.map((tour) => tour.ubicacion).filter(Boolean))],
    [tours],
  );
  const filteredTours = useMemo(() => {
    let result = [...tours];
    const value = search.trim().toLowerCase();
    if (value)
      result = result.filter((tour) =>
        [tour.nombre, tour.descripcion, tour.ubicacion, tour.categoria].some(
          (field) => field?.toLowerCase().includes(value),
        ),
      );
    if (category) result = result.filter((tour) => tour.categoria === category);
    if (location) result = result.filter((tour) => tour.ubicacion === location);
    if (maxPrice)
      result = result.filter((tour) => Number(tour.precio) <= Number(maxPrice));
    if (sort === "price-asc") result.sort((a, b) => a.precio - b.precio);
    if (sort === "price-desc") result.sort((a, b) => b.precio - a.precio);
    if (sort === "name-asc")
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (sort === "name-desc")
      result.sort((a, b) => b.nombre.localeCompare(a.nombre));
    return result;
  }, [tours, search, category, location, maxPrice, sort]);
  const selectedCompareTours = useMemo(
    () =>
      selectedCompareIds
        .map((id) => tours.find((tour) => String(tour.id) === String(id)))
        .filter(Boolean),
    [selectedCompareIds, tours],
  );
  const handleCompare = (id) => {
    const sid = String(id);
    if (selectedCompareIds.includes(sid)) {
      setSelectedCompareIds((current) =>
        current.filter((item) => item !== sid),
      );
      return;
    }
    if (selectedCompareIds.length >= 3) {
      Swal.fire({
        icon: "info",
        title: "Límite de comparación",
        text: "Solo puedes comparar hasta 3 experiencias al mismo tiempo.",
        confirmButtonColor: "#176A4E",
      });
      return;
    }
    setSelectedCompareIds((current) => [...current, sid]);
  };
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setMaxPrice("");
    setSort("");
  };
  const remove = (id) =>
    setSelectedCompareIds((current) =>
      current.filter((item) => String(item) !== String(id)),
    );
  const clear = () => {
    setSelectedCompareIds([]);
    setShowComparison(false);
  };
  return (
    <>
      <main className="marketplace-page">
        <section className="marketplace-header">
          <div className="marketplace-header-content">
            <span className="section-eyebrow">{t("marketplace.eyebrow")}</span>
            <h1>{t("marketplace.title")}</h1>
            <p>{t("marketplace.description")}</p>
          </div>
        </section>
        <section className="marketplace-content">
          <div className="marketplace-layout">
            <aside className="marketplace-filters">
              <div className="filters-header">
                <div>
                  <span className="section-eyebrow">
                    {t("marketplace.filter")}
                  </span>
                  <h2>{t("marketplace.find")}</h2>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-filters-button"
                >
                  {t("marketplace.clear")}
                </button>
              </div>
              <div className="filter-group">
                <label htmlFor="marketplace-search">
                  {t("marketplace.search")}
                </label>
                <input
                  id="marketplace-search"
                  type="search"
                  placeholder={t("marketplace.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="category-filter">
                  {t("marketplace.category")}
                </label>
                <select
                  id="category-filter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">{t("marketplace.allCategories")}</option>
                  {categories.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="location-filter">
                  {t("marketplace.location")}
                </label>
                <select
                  id="location-filter"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">{t("marketplace.allLocations")}</option>
                  {locations.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="price-filter">
                  {t("marketplace.maxPrice")}
                </label>
                <input
                  id="price-filter"
                  type="number"
                  min="0"
                  placeholder="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="sort-filter">{t("marketplace.sort")}</label>
                <select
                  id="sort-filter"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">{t("marketplace.recommended")}</option>
                  <option value="price-asc">{t("marketplace.lowHigh")}</option>
                  <option value="price-desc">{t("marketplace.highLow")}</option>
                  <option value="name-asc">{t("marketplace.nameAZ")}</option>
                  <option value="name-desc">{t("marketplace.nameZA")}</option>
                </select>
              </div>
            </aside>
            <div className="marketplace-results">
              <div className="marketplace-results-header">
                <div>
                  <span className="results-count">
                    {filteredTours.length} {t("marketplace.experiences")}
                  </span>
                  <h2>{t("marketplace.available")}</h2>
                </div>
                {selectedCompareTours.length > 0 && (
                  <span className="comparison-counter">
                    {selectedCompareTours.length} {t("marketplace.selected")}
                  </span>
                )}
              </div>
              {loading && (
                <div className="marketplace-state">
                  <p>{t("marketplace.loading")}</p>
                </div>
              )}
              {!loading && error && (
                <div className="marketplace-state error">
                  <p>{error}</p>
                </div>
              )}
              {!loading && !error && !filteredTours.length && (
                <div className="marketplace-state">
                  <h3>{t("marketplace.emptyTitle")}</h3>
                  <p>{t("marketplace.emptyText")}</p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={clearFilters}
                  >
                    {t("marketplace.clearFilters")}
                  </button>
                </div>
              )}
              {!loading && !error && filteredTours.length > 0 && (
                <div className="tour-grid">
                  {filteredTours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      {...tour}
                      isCompared={selectedCompareIds.includes(String(tour.id))}
                      onCompare={handleCompare}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      {!showComparison && (
        <CompareBar
          selectedTours={selectedCompareTours}
          onRemove={remove}
          onClear={clear}
          onOpenComparison={() => setShowComparison(true)}
        />
      )}

      {showComparison && (
        <ComparisonModal
          selectedTours={selectedCompareTours}
          onClose={() => setShowComparison(false)}
          onRemove={remove}
          onClear={clear}
        />
      )}
    </>
  );
}
export default Marketplace;
