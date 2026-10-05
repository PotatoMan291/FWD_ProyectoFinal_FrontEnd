import { countBy, filterTours, formatCRC } from "./tourUtils.js";

describe("formatCRC", () => {
  test("formatea un precio en colones", () => {
    expect(formatCRC(35000)).toContain("35.000");
  });
});

describe("filterTours", () => {
  const tours = [{ nombre: "Canopy Monteverde", descripcion: "Aventura", categoria: "Aventura", ubicacion: "Puntarenas" }, { nombre: "Playa Tamarindo", descripcion: "Atardecer", categoria: "Playa", ubicacion: "Guanacaste" }];
  test("encuentra tours por nombre", () => {
    expect(filterTours(tours, "canopy")).toHaveLength(1);
  });
  test("devuelve todos cuando la búsqueda está vacía", () => {
    expect(filterTours(tours, "")).toHaveLength(2);
  });
});

describe("countBy", () => {
  test("cuenta elementos por categoría", () => {
    expect(countBy([{ categoria: "Playa" }, { categoria: "Playa" }, { categoria: "Aventura" }], "categoria")).toEqual({ Playa: 2, Aventura: 1 });
  });
});
