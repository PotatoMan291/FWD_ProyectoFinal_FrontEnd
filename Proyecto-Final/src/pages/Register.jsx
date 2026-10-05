import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const {
    login,
  } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

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

    if (!formData.nombre.trim()) {
      newErrors.nombre =
        "Ingresa tu nombre.";
    } else if (
      formData.nombre.trim().length < 2
    ) {
      newErrors.nombre =
        "El nombre debe tener al menos 2 caracteres.";
    }

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
        "Ingresa una contraseña.";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "La contraseña debe tener al menos 6 caracteres.";
    }

    if (
      !formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Confirma tu contraseña.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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

      const existingUser = users.find(
        (user) =>
          user.correo.toLowerCase() ===
          correo
      );

      if (existingUser) {
        setErrors({
          correo:
            "Ya existe una cuenta con este correo.",
        });

        return;
      }

      const newUser = {
        id: crypto.randomUUID(),
        nombre:
          formData.nombre.trim(),
        correo,
        password:
          formData.password,
        rol: "turista",
      };

      const createdUser =
        await api.post(
          "/usuarios",
          newUser
        );

      login(createdUser);

      await Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text:
          "Tu cuenta de PuraVida Trips fue creada correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/turista", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Error al registrar usuario:",
        error
      );

      await Swal.fire({
        icon: "error",
        title: "No se pudo crear la cuenta",
        text:
          "Ocurrió un problema al comunicarse con el servidor.",
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
        className="auth-card auth-card-register"
        aria-labelledby="register-title"
      >
        <div className="auth-header">
          <p className="section-eyebrow">
            PURAVIDA TRIPS
          </p>

          <h1 id="register-title">
            Crear cuenta
          </h1>

          <p>
            Regístrate para comenzar a
            descubrir nuevas experiencias.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-field">
            <label htmlFor="nombre">
              Nombre completo
            </label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              autoComplete="name"
              aria-invalid={Boolean(
                errors.nombre
              )}
              aria-describedby={
                errors.nombre
                  ? "nombre-error"
                  : undefined
              }
            />

            {errors.nombre && (
              <span
                id="nombre-error"
                className="form-error"
              >
                {errors.nombre}
              </span>
            )}
          </div>

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
                  ? "register-correo-error"
                  : undefined
              }
            />

            {errors.correo && (
              <span
                id="register-correo-error"
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
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              aria-invalid={Boolean(
                errors.password
              )}
              aria-describedby={
                errors.password
                  ? "register-password-error"
                  : undefined
              }
            />

            {errors.password && (
              <span
                id="register-password-error"
                className="form-error"
              >
                {errors.password}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">
              Confirmar contraseña
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              aria-invalid={Boolean(
                errors.confirmPassword
              )}
              aria-describedby={
                errors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
            />

            {errors.confirmPassword && (
              <span
                id="confirm-password-error"
                className="form-error"
              >
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Creando cuenta..."
              : "Crear cuenta"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes una cuenta?
          </p>

          <Link to="/login">
            Iniciar sesión
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Register;