import {
  sanitizeUser,
  normalizeUser,
  filterUsers,
  countUsersByRole,
  isLastAdmin,
  validateUser,
} from "./userUtils.js";

describe("sanitizeUser", () => {
  test("elimina la contraseña del usuario", () => {
    const result = sanitizeUser({
      id: "1",
      nombre: "Andrés",
      password: "123456",
    });

    expect(result.password).toBeUndefined();
    expect(result.nombre).toBe("Andrés");
  });
});

describe("normalizeUser", () => {
  test("limpia nombre y correo", () => {
    const result = normalizeUser({
      nombre: "  Andrés Pérez  ",
      correo: "  ANDRES@EMAIL.COM ",
      rol: "turista",
    });

    expect(result.nombre).toBe("Andrés Pérez");
    expect(result.correo).toBe("andres@email.com");
    expect(result.rol).toBe("turista");
  });
});

describe("filterUsers", () => {
  const users = [
    {
      id: "1",
      nombre: "Andrés Pérez",
      correo: "andres@email.com",
      rol: "admin",
    },
    {
      id: "2",
      nombre: "Steven Salas",
      correo: "steven@email.com",
      rol: "turista",
    },
    {
      id: "3",
      nombre: "Operador Demo",
      correo: "operador@email.com",
      rol: "operador",
    },
  ];

  test("filtra usuarios por nombre", () => {
    expect(
      filterUsers(users, "Steven"),
    ).toHaveLength(1);
  });

  test("filtra usuarios por rol", () => {
    expect(
      filterUsers(users, "", "operador"),
    ).toHaveLength(1);
  });
});

describe("countUsersByRole", () => {
  test("cuenta correctamente los administradores", () => {
    const users = [
      { rol: "admin" },
      { rol: "admin" },
      { rol: "turista" },
    ];

    expect(
      countUsersByRole(users, "admin"),
    ).toBe(2);
  });
});

describe("isLastAdmin", () => {
  test("detecta cuando solamente queda un administrador", () => {
    const users = [
      { id: "1", rol: "admin" },
      { id: "2", rol: "turista" },
    ];

    expect(
      isLastAdmin(users, "1"),
    ).toBe(true);
  });
});

describe("validateUser", () => {
  test("rechaza un correo duplicado", () => {
    const users = [
      {
        id: "1",
        nombre: "Andrés",
        correo: "andres@email.com",
        rol: "admin",
      },
    ];

    const errors = validateUser(
      {
        nombre: "Otro usuario",
        correo: "andres@email.com",
        password: "123456",
        rol: "turista",
      },
      users,
    );

    expect(errors.correo).toBe(
      "Ya existe un usuario con ese correo.",
    );
  });
});