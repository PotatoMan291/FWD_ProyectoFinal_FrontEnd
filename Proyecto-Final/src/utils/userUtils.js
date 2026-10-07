export function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export function normalizeUser(user) {
  return {
    ...user,
    nombre: user.nombre?.trim() || "",
    correo: user.correo?.trim().toLowerCase() || "",
    rol: user.rol || "turista",
  };
}

export function filterUsers(users, search = "", role = "todos") {
  const value = search.trim().toLowerCase();

  return users.filter((user) => {
    const matchesSearch =
      !value ||
      user.nombre?.toLowerCase().includes(value) ||
      user.correo?.toLowerCase().includes(value);

    const matchesRole =
      role === "todos" || user.rol === role;

    return matchesSearch && matchesRole;
  });
}

export function countUsersByRole(users, role) {
  return users.filter((user) => user.rol === role).length;
}

export function isLastAdmin(users, userId) {
  const admins = users.filter((user) => user.rol === "admin");

  return (
    admins.length === 1 &&
    String(admins[0].id) === String(userId)
  );
}

export function validateUser(user, existingUsers = [], editingId = null) {
  const errors = {};

  if (!user.nombre?.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  }

  if (!user.correo?.trim()) {
    errors.correo = "El correo es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.correo)) {
    errors.correo = "El correo no es válido.";
  }

  const duplicatedEmail = existingUsers.some(
    (existingUser) =>
      existingUser.correo?.toLowerCase() ===
        user.correo?.trim().toLowerCase() &&
      String(existingUser.id) !== String(editingId),
  );

  if (duplicatedEmail) {
    errors.correo = "Ya existe un usuario con ese correo.";
  }

  if (!editingId && !user.password?.trim()) {
    errors.password = "La contraseña es obligatoria.";
  }

  if (user.password && user.password.length < 6) {
    errors.password =
      "La contraseña debe tener al menos 6 caracteres.";
  }

  if (!["admin", "operador", "turista"].includes(user.rol)) {
    errors.rol = "El rol seleccionado no es válido.";
  }

  return errors;
}