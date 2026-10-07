import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import { getTours, updateTour } from "../services/tourService";
import AITripAssistant from "../components/AITripAssistant";
import CloudinaryUploadButton from "../components/CloudinaryUploadButton";

import {
  getHistoricalMetrics,
  getMetricsPrediction,
} from "../services/metricsService";

import { createUser, updateUser, deleteUser } from "../services/userService";

import { filterUsers, normalizeUser, validateUser } from "../utils/userUtils";

function StatCard({ label, value }) {
  return (
    <article className="dashboard-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
function BarChart({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className="dashboard-chart-bars">
      {data.map((item) => (
        <div className="dashboard-bar-item" key={item.label}>
          <div className="dashboard-bar-track">
            <div
              className="dashboard-bar-fill"
              style={{ height: `${Math.max((item.value / max) * 100, 4)}%` }}
            />
          </div>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function UserManagement({ users, currentUser, onUsersChange }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");

  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyUser = {
    nombre: "",
    correo: "",
    password: "",
    rol: "turista",
  };

  const [formData, setFormData] = useState(emptyUser);
  const [errors, setErrors] = useState({});

  const filteredUsers = useMemo(
    () => filterUsers(users, search, roleFilter),
    [users, search, roleFilter],
  );

  const openCreateForm = () => {
    setEditingUser(null);
    setFormData(emptyUser);
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setEditingUser(user);

    setFormData({
      nombre: user.nombre || "",
      correo: user.correo || "",
      password: "",
      rol: user.rol || "turista",
    });

    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData(emptyUser);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedUser = normalizeUser(formData);

    const validationErrors = validateUser(
      normalizedUser,
      users,
      editingUser?.id,
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);

    try {
      if (editingUser) {
        const dataToUpdate = {
          nombre: normalizedUser.nombre,
          correo: normalizedUser.correo,
          rol: normalizedUser.rol,
        };

        if (normalizedUser.password) {
          dataToUpdate.password = normalizedUser.password;
        }

        const updatedUser = await updateUser(editingUser.id, dataToUpdate);

        const updatedUsers = users.map((user) =>
          String(user.id) === String(editingUser.id) ? updatedUser : user,
        );

        onUsersChange(updatedUsers);

        await Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          text: "La información del usuario fue actualizada.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const newUser = await createUser({
          nombre: normalizedUser.nombre,
          correo: normalizedUser.correo,
          password: normalizedUser.password,
          rol: normalizedUser.rol,
        });

        onUsersChange([...users, newUser]);

        await Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "El usuario fue registrado correctamente.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      closeForm();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: error.message || "Ocurrió un error inesperado.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (String(user.id) === String(currentUser.id)) {
      Swal.fire({
        icon: "warning",
        title: "Acción no permitida",
        text: "No puedes eliminar la cuenta de administrador que estás utilizando.",
      });

      return;
    }

    const adminUsers = users.filter((item) => item.rol === "admin");

    if (user.rol === "admin" && adminUsers.length === 1) {
      Swal.fire({
        icon: "warning",
        title: "No se puede eliminar",
        text: "El sistema debe conservar al menos un administrador.",
      });

      return;
    }

    const confirmation = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: `Se eliminará la cuenta de ${user.nombre}.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#b42318",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      await deleteUser(user.id);

      onUsersChange(
        users.filter((item) => String(item.id) !== String(user.id)),
      );

      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: error.message || "Ocurrió un error inesperado.",
      });
    }
  };

  return (
    <section className="dashboard-card user-management-card">
      <div className="dashboard-card-header">
        <div>
          <span className="section-eyebrow">ADMINISTRACIÓN</span>

          <h2>Gestión de usuarios</h2>

          <p>
            Administra la información, roles y cuentas registradas en PuraVida
            Trips.
          </p>
        </div>

        <button
          className="button button-primary"
          type="button"
          onClick={openCreateForm}
        >
          Nuevo usuario
        </button>
      </div>

      <div className="user-management-filters">
        <label>
          Buscar
          <input
            type="search"
            placeholder="Nombre o correo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          Rol
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="turista">Turistas</option>
            <option value="operador">Operadores</option>
            <option value="admin">Administradores</option>
          </select>
        </label>
      </div>

      <div className="user-table-wrapper">
        <table className="user-management-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4">No se encontraron usuarios.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.nombre}</strong>
                  </td>

                  <td>{user.correo}</td>

                  <td>
                    <span className={`user-role-badge user-role-${user.rol}`}>
                      {user.rol}
                    </span>
                  </td>

                  <td>
                    <div className="user-table-actions">
                      <button
                        className="button button-outline"
                        type="button"
                        onClick={() => openEditForm(user)}
                      >
                        Editar
                      </button>

                      <button
                        className="button button-danger"
                        type="button"
                        onClick={() => handleDelete(user)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="user-form-overlay">
          <div className="user-form-modal">
            <div className="user-form-header">
              <div>
                <span className="section-eyebrow">USUARIOS</span>

                <h3>{editingUser ? "Editar usuario" : "Nuevo usuario"}</h3>
              </div>

              <button
                type="button"
                className="user-modal-close"
                onClick={closeForm}
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </div>

            <form className="dashboard-form" onSubmit={handleSubmit}>
              <label>
                Nombre
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  autoComplete="name"
                />
                {errors.nombre && (
                  <small className="form-error">{errors.nombre}</small>
                )}
              </label>

              <label>
                Correo
                <input
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.correo && (
                  <small className="form-error">{errors.correo}</small>
                )}
              </label>

              <label>
                {editingUser ? "Nueva contraseña" : "Contraseña"}

                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={editingUser ? "new-password" : "new-password"}
                  placeholder={
                    editingUser ? "Dejar vacío para conservarla" : ""
                  }
                />

                {errors.password && (
                  <small className="form-error">{errors.password}</small>
                )}
              </label>

              <label>
                Rol
                <select name="rol" value={formData.rol} onChange={handleChange}>
                  <option value="turista">Turista</option>

                  <option value="operador">Operador</option>

                  <option value="admin">Administrador</option>
                </select>
                {errors.rol && (
                  <small className="form-error">{errors.rol}</small>
                )}
              </label>

              <div className="user-form-actions">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={closeForm}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : editingUser
                      ? "Guardar cambios"
                      : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function AdminDashboard({
  tours,
  users,
  reservations,
  currentUser,
  onUsersChange,
}) {
  const { t } = useLanguage();

  const [historicalMetrics, setHistoricalMetrics] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [forecastPeriods, setForecastPeriods] = useState(3);

  const categories = useMemo(
    () =>
      Object.entries(
        tours.reduce((acc, tour) => {
          acc[tour.categoria] = (acc[tour.categoria] || 0) + 1;
          return acc;
        }, {}),
      ).map(([label, value]) => ({ label, value })),
    [tours],
  );

  const roles = useMemo(
    () =>
      Object.entries(
        users.reduce((acc, user) => {
          acc[user.rol] = (acc[user.rol] || 0) + 1;
          return acc;
        }, {}),
      ).map(([label, value]) => ({ label, value })),
    [users],
  );

  const revenue = reservations.reduce(
    (sum, item) => sum + Number(item.total || item.precio || 0),
    0,
  );

  useEffect(() => {
    getHistoricalMetrics()
      .then((data) => {
        setHistoricalMetrics(data);
      })
      .catch((error) => {
        console.error("No se pudieron obtener las métricas históricas:", error);
      });
  }, []);

  const generatePrediction = async () => {
    setLoadingPrediction(true);
    setPredictionError("");

    try {
      const current = {
        users: users.length,
        tours: tours.length,
        reservations: reservations.length,
        revenue,
      };

      const history = historicalMetrics.map((item) => ({
        month: item.periodo,
        users: Number(item.usuarios || 0),
        tours: Number(item.tours || 0),
        reservations: Number(item.reservas || 0),
        revenue: Number(item.ingresos || 0),
      }));

      const result = await getMetricsPrediction({
        current,
        history,
        forecastPeriods: Number(forecastPeriods),
        language: "es",
      });

      setPrediction(result);
    } catch (error) {
      console.error("Error generando predicción:", error);

      setPredictionError(error.message || "No se pudo generar la predicción.");
    } finally {
      setLoadingPrediction(false);
    }
  };

  return (
    <div className="dashboard-stack">
      <div className="dashboard-stats">
        <StatCard label={t("dashboard.totalUsers")} value={users.length} />

        <StatCard label={t("dashboard.totalTours")} value={tours.length} />

        <StatCard
          label={t("dashboard.operators")}
          value={users.filter((user) => user.rol === "operador").length}
        />

        <StatCard
          label={t("dashboard.reservations")}
          value={reservations.length}
        />

        <StatCard
          label={t("dashboard.revenue")}
          value={`₡${revenue.toLocaleString("es-CR")}`}
        />
      </div>

      <div className="dashboard-chart-grid">
        <section className="dashboard-card">
          <h2>{t("dashboard.categories")}</h2>
          <BarChart data={categories} />
        </section>

        <section className="dashboard-card">
          <h2>{t("dashboard.roles")}</h2>
          <BarChart data={roles} />
        </section>
      </div>

      <section className="dashboard-card metrics-prediction-card">
        <div className="dashboard-card-header">
          <div>
            <span className="section-eyebrow">INTELIGENCIA ARTIFICIAL</span>

            <h2>Proyección de métricas</h2>

            <p>
              Genera una estimación de crecimiento utilizando las métricas
              históricas del sistema.
            </p>
          </div>

          <div className="metrics-prediction-controls">
            <label htmlFor="forecast-periods">Período de predicción</label>

            <select
              id="forecast-periods"
              value={forecastPeriods}
              onChange={(event) => {
                setForecastPeriods(Number(event.target.value));
                setPrediction(null);
                setPredictionError("");
              }}
            >
              <option value={3}>Próximos 3 meses</option>
              <option value={6}>Próximos 6 meses</option>
              <option value={12}>Próximos 12 meses</option>
            </select>

            <button
              className="button button-primary"
              type="button"
              onClick={generatePrediction}
              disabled={loadingPrediction || historicalMetrics.length === 0}
            >
              {loadingPrediction ? "Generando..." : "Generar proyección"}
            </button>
          </div>
        </div>

        {historicalMetrics.length === 0 && (
          <p className="dashboard-muted">Cargando métricas históricas...</p>
        )}

        {predictionError && (
          <div className="metrics-prediction-error">
            <strong>No se pudo generar la proyección.</strong>
            <span>{predictionError}</span>
          </div>
        )}

        {prediction && (
          <div className="metrics-prediction-result">
            <div className="metrics-prediction-summary">
              <h3>Resumen</h3>
              <p>{prediction.summary}</p>

              {prediction.confidence && (
                <span className="dashboard-role-badge">
                  Confianza: {prediction.confidence}
                </span>
              )}
            </div>

            {Array.isArray(prediction.forecast) &&
              prediction.forecast.length > 0 && (
                <div className="metrics-forecast-grid">
                  {prediction.forecast.map((item, index) => (
                    <article
                      className="metrics-forecast-item"
                      key={`${item.period}-${index}`}
                    >
                      <h3>{item.period}</h3>

                      <div>
                        <span>Usuarios</span>
                        <strong>
                          {Number(item.users || 0).toLocaleString("es-CR")}
                        </strong>
                      </div>

                      <div>
                        <span>Tours</span>
                        <strong>
                          {Number(item.tours || 0).toLocaleString("es-CR")}
                        </strong>
                      </div>

                      <div>
                        <span>Reservas</span>
                        <strong>
                          {Number(item.reservations || 0).toLocaleString(
                            "es-CR",
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Ingresos</span>
                        <strong>
                          ₡{Number(item.revenue || 0).toLocaleString("es-CR")}
                        </strong>
                      </div>
                    </article>
                  ))}
                </div>
              )}

            {prediction.growth && (
              <div className="metrics-growth">
                <h3>Crecimiento estimado</h3>

                <div className="metrics-growth-grid">
                  <div>
                    <span>Usuarios</span>
                    <strong>{prediction.growth.users}%</strong>
                  </div>

                  <div>
                    <span>Tours</span>
                    <strong>{prediction.growth.tours}%</strong>
                  </div>

                  <div>
                    <span>Reservas</span>
                    <strong>{prediction.growth.reservations}%</strong>
                  </div>

                  <div>
                    <span>Ingresos</span>
                    <strong>{prediction.growth.revenue}%</strong>
                  </div>
                </div>
              </div>
            )}

            {Array.isArray(prediction.insights) &&
              prediction.insights.length > 0 && (
                <div className="metrics-insights">
                  <h3>Insights de IA</h3>

                  <ul>
                    {prediction.insights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
      </section>

      <UserManagement
        users={users}
        currentUser={currentUser}
        onUsersChange={onUsersChange}
      />

      <section className="dashboard-card">
        <h2>Administración</h2>

        <div className="dashboard-actions">
          <Link className="button button-primary" to="/tours">
            Gestionar tours
          </Link>

          <Link className="button button-outline" to="/tours">
            Ver marketplace
          </Link>
        </div>
      </section>
    </div>
  );
}

function TouristDashboard({
  user,
  tours,
  reservations,
  favorites,
  refreshUser,
}) {
  const { t } = useLanguage();
  const [name, setName] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.correo || "");
  const [saving, setSaving] = useState(false);
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = {
        ...user,
        nombre: name.trim(),
        correo: email.trim().toLowerCase(),
      };
      await api.patch(`/usuarios/${user.id}`, {
        nombre: updated.nombre,
        correo: updated.correo,
      });
      localStorage.setItem(
        "puravida_auth",
        JSON.stringify({
          id: updated.id,
          nombre: updated.nombre,
          correo: updated.correo,
          rol: updated.rol,
        }),
      );
      refreshUser(updated);
      await Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar",
        text: error.message,
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="dashboard-stack">
      <div className="dashboard-stats">
        <StatCard label={t("dashboard.favorites")} value={favorites.length} />
        <StatCard
          label={t("dashboard.reservationHistory")}
          value={reservations.length}
        />
        <StatCard label={t("dashboard.totalTours")} value={tours.length} />
      </div>
      <div className="dashboard-two-column">
        <section className="dashboard-card">
          <h2>{t("dashboard.profile")}</h2>
          <form className="dashboard-form" onSubmit={save}>
            <label>
              {t("auth.name")}
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              {t("auth.email")}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button
              className="button button-primary"
              type="submit"
              disabled={saving}
            >
              {saving ? "Guardando..." : t("dashboard.save")}
            </button>
          </form>
        </section>
        <section className="dashboard-card">
          <h2>{t("dashboard.reservationHistory")}</h2>
          {reservations.length === 0 ? (
            <p>Aún no tienes reservas registradas.</p>
          ) : (
            <ul className="dashboard-list">
              {reservations.map((reservation) => (
                <li key={reservation.id}>
                  <strong>
                    {reservation.tourNombre || `Reserva #${reservation.id}`}
                  </strong>
                  <span>{reservation.estado || "Pendiente"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <AITripAssistant />
    </div>
  );
}

function OperatorDashboard({ user, tours }) {
  const { t } = useLanguage();
  const ownTours = tours.filter(
    (tour) =>
      String(tour.operadorId) === String(user.id) ||
      tour.operador === user.nombre,
  );
  const [selectedTourId, setSelectedTourId] = useState(ownTours[0]?.id || "");
  const [uploaded, setUploaded] = useState(null);
  const attachMedia = async (info) => {
    setUploaded(info);
    if (!selectedTourId) return;
    try {
      const field = info.resource_type === "video" ? "video" : "imagen";
      await updateTour(selectedTourId, { [field]: info.secure_url });
      Swal.fire({
        icon: "success",
        title: "Tour actualizado",
        text: "El recurso de Cloudinary quedó asociado al tour.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar el tour",
        text: error.message,
      });
    }
  };
  return (
    <div className="dashboard-stack">
      <div className="dashboard-stats">
        <StatCard
          label={t("dashboard.operatorTours")}
          value={ownTours.length}
        />
        <StatCard label={t("dashboard.reservations")} value={0} />
        <StatCard label={t("dashboard.totalTours")} value={tours.length} />
      </div>
      <section className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h2>{t("dashboard.operatorTours")}</h2>
            <p>Administra las experiencias asociadas a tu operación.</p>
          </div>
          <Link className="button button-primary" to="/tours">
            Ver catálogo
          </Link>
        </div>
        {ownTours.length === 0 ? (
          <p>No hay tours asociados a este operador todavía.</p>
        ) : (
          <div className="dashboard-tour-list">
            {ownTours.map((tour) => (
              <article key={tour.id}>
                <img src={tour.imagen} alt="" />
                <div>
                  <strong>{tour.nombre}</strong>
                  <span>
                    {tour.ubicacion} · ₡
                    {Number(tour.precio).toLocaleString("es-CR")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="dashboard-card">
        <h2>{t("dashboard.upload")}</h2>
        <p>
          Selecciona un tour y sube su imagen o video directamente a Cloudinary.
        </p>
        <div className="dashboard-form">
          <label>
            Tour
            <select
              value={selectedTourId}
              onChange={(e) => setSelectedTourId(e.target.value)}
            >
              <option value="">Selecciona un tour</option>
              {ownTours.map((tour) => (
                <option key={tour.id} value={tour.id}>
                  {tour.nombre}
                </option>
              ))}
            </select>
          </label>
          <CloudinaryUploadButton onUploaded={attachMedia} />
        </div>
        {uploaded && (
          <div className="dashboard-upload-result">
            <label>{t("dashboard.mediaUrl")}</label>
            <input readOnly value={uploaded.secure_url || ""} />
            <small>
              {uploaded.resource_type} · {uploaded.format}
            </small>
          </div>
        )}
      </section>
    </div>
  );
}

function RoleDashboard({ role }) {
  const { user, updateSessionUser } = useAuth();
  const { t } = useLanguage();
  const [tours, setTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      getTours(),
      api.get("/usuarios"),
      api.get("/reservas"),
      api.get("/favoritos"),
    ])
      .then(([tourData, userData, reservationData, favoriteData]) => {
        setTours(tourData);
        setUsers(userData);
        setReservations(
          reservationData.filter(
            (item) =>
              String(item.usuarioId) === String(user.id) || role === "admin",
          ),
        );
        setFavorites(
          favoriteData.filter(
            (item) => String(item.usuarioId) === String(user.id),
          ),
        );
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [role, user.id]);
  if (loading)
    return (
      <main className="dashboard-page">
        <div className="dashboard-loading">Cargando dashboard...</div>
      </main>
    );
  const title =
    role === "admin"
      ? t("dashboard.adminTitle")
      : role === "operador"
        ? t("dashboard.operatorTitle")
        : t("dashboard.touristTitle");
  const description =
    role === "admin"
      ? t("dashboard.adminDescription")
      : role === "operador"
        ? t("dashboard.operatorDescription")
        : t("dashboard.touristDescription");
  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <div>
            <span className="section-eyebrow">PURAVIDA TRIPS · DASHBOARD</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <span className="dashboard-role-badge">{user.nombre}</span>
        </header>
        {role === "admin" && (
          <AdminDashboard
            tours={tours}
            users={users}
            reservations={reservations}
            currentUser={user}
            onUsersChange={setUsers}
          />
        )}{" "}
        {role === "turista" && (
          <TouristDashboard
            user={user}
            tours={tours}
            reservations={reservations}
            favorites={favorites}
            refreshUser={updateSessionUser}
          />
        )}{" "}
        {role === "operador" && <OperatorDashboard user={user} tours={tours} />}
      </div>
    </main>
  );
}
export default RoleDashboard;
