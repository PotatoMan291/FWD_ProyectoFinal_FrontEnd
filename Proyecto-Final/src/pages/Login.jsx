import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
  } = useAuth();

  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.correo.trim()) {
      newErrors.correo =
        "Ingresa tu correo electrónico.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.correo
      )
    ) {
      newErrors.correo =
        "Ingresa un correo electrónico válido.";
    }

    if (!formData.password) {
      newErrors.password =
        "Ingresa tu contraseña.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getRedirectPath = (user) => {
    const previousPath =
      location.state?.from;

    if (previousPath) {
      return previousPath;
    }

    if (user.rol === "admin") {
      return "/admin";
    }

    if (user.rol === "operador") {
      return "/operador";
    }

    return "/";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const correo = formData.correo
        .trim()
        .toLowerCase();

      const users = await api.get(
        `/usuarios?correo=${encodeURIComponent(
          correo
        )}`
      );

      const foundUser = users.find(
        (user) =>
          user.correo.toLowerCase() === correo &&
          user.password === formData.password
      );

      if (!foundUser) {
        await Swal.fire({
          icon: "error",
          title: "No pudimos iniciar sesión",
          text:
            "El correo o la contraseña son incorrectos.",
          confirmButtonText: "Intentar nuevamente",
          confirmButtonColor:
            "#176a4e",
        });

        return;
      }

      const sessionUser = login(foundUser);

      await Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: `Hola, ${sessionUser.nombre}.`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(
        getRedirectPath(sessionUser),
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error
      );

      await Swal.fire({
        icon: "error",
        title: "No se pudo iniciar sesión",
        text:
          "No fue posible conectarse con el servidor. Verifica que JSON Server esté ejecutándose.",
        confirmButtonText: "Aceptar",
        confirmButtonColor:
          "#176a4e",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section
        className="auth-card"
        aria-labelledby="login-title"
      >
        <div className="auth-header">
          <p className="section-eyebrow">
            PURAVIDA TRIPS
          </p>

          <h1 id="login-title">
            Iniciar sesión
          </h1>

          <p>
            Ingresa a tu cuenta para continuar
            explorando Costa Rica.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-field">
            <label htmlFor="correo">
              Correo electrónico
            </label>

            <input
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              aria-invalid={Boolean(
                errors.correo
              )}
              aria-describedby={
                errors.correo
                  ? "correo-error"
                  : undefined
              }
            />

            {errors.correo && (
              <span
                id="correo-error"
                className="form-error"
              >
                {errors.correo}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              aria-invalid={Boolean(
                errors.password
              )}
              aria-describedby={
                errors.password
                  ? "password-error"
                  : undefined
              }
            />

            {errors.password && (
              <span
                id="password-error"
                className="form-error"
              >
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes una cuenta?
          </p>

          <Link to="/register">
            Crear una cuenta
          </Link>
        </div>

        <div className="auth-demo">
          <p>
            <strong>
              Usuarios de demostración
            </strong>
          </p>

          <span>
            turista@puravidatrips.com
            {" / "}
            123456
          </span>

          <span>
            operador@puravidatrips.com
            {" / "}
            123456
          </span>

          <span>
            admin@puravidatrips.com
            {" / "}
            admin123
          </span>
        </div>
      </section>
    </main>
  );
}

export default Login;