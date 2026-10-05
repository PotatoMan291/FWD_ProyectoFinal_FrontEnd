export function formatCRC(value, locale = "es-CR") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(Number(value) || 0);
}
export function filterTours(tours, search = "") {
  const value = search.trim().toLowerCase();
  if (!value) return tours;
  return tours.filter((tour) => [tour.nombre, tour.descripcion, tour.ubicacion, tour.categoria].some((field) => field?.toLowerCase().includes(value)));
}
export function countBy(tours, field) {
  return tours.reduce((acc, item) => { const key = item[field] || "Sin definir"; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
}
