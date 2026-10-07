import {
  countBy,
  filterTours,
  formatCRC,
} from "./tourUtils.js";

describe("formatCRC", () => {
  test("convierte un número a moneda CRC", () => {
    expect(formatCRC(35000)).toMatch(/₡35\s000/);
  });

  test("convierte cero correctamente", () => {
    expect(formatCRC(0)).toMatch(/₡0/);
  });

  test("maneja valores inválidos como cero", () => {
    expect(formatCRC("abc")).toMatch(/₡0/);
  });
});

describe("filterTours", () => {
  const tours = [
    {
      nombre: "Canopy Monteverde",
      descripcion: "Aventura",
      categoria: "Aventura",
      ubicacion: "Puntarenas",
    },
    {
      nombre: "Playa Tamarindo",
      descripcion: "Atardecer",
      categoria: "Playa",
      ubicacion: "Guanacaste",
    },
    {
      nombre: "Volcán Arenal",
      descripcion: "Naturaleza",
      categoria: "Naturaleza",
      ubicacion: "Alajuela",
    },
  ];

  test("encuentra tours por nombre", () => {
    expect(
      filterTours(tours, "canopy"),
    ).toHaveLength(1);
  });

  test("devuelve todos cuando la búsqueda está vacía", () => {
    expect(
      filterTours(tours, ""),
    ).toHaveLength(3);
  });

  test("busca sin distinguir mayúsculas", () => {
    expect(
      filterTours(tours, "TAMARINDO"),
    ).toHaveLength(1);
  });

  test("busca también por ubicación", () => {
    expect(
      filterTours(tours, "Alajuela"),
    ).toHaveLength(1);
  });

  test("devuelve un arreglo vacío cuando no encuentra resultados", () => {
    expect(
      filterTours(tours, "Cartago"),
    ).toHaveLength(0);
  });
});

describe("countBy", () => {
  test("cuenta elementos por categoría", () => {
    expect(
      countBy(
        [
          { categoria: "Playa" },
          { categoria: "Playa" },
          { categoria: "Aventura" },
        ],
        "categoria",
      ),
    ).toEqual({
      Playa: 2,
      Aventura: 1,
    });
  });

  test("agrupa elementos sin valor bajo Sin definir", () => {
    expect(
      countBy(
        [
          { categoria: "Playa" },
          {},
          {},
        ],
        "categoria",
      ),
    ).toEqual({
      Playa: 1,
      "Sin definir": 2,
    });
  });

  test("devuelve un objeto vacío para una lista vacía", () => {
    expect(countBy([], "categoria")).toEqual({});
  });
});