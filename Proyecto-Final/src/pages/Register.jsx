import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";

import api from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useLanguage,
} from "../context/LanguageContext";

function generateId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function Register() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const { t } =
    useLanguage();

  const [formData, setFormData] =
    useState({
      nombre: "",
      correo: "",
      password: "",
      confirmPassword: "",
    });

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setErrors(
      (previous) => ({
        ...previous,
        [name]: "",
      })
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre =
        t(
          "auth.nameRequired"
        );
    } else if (
      formData.nombre.trim()
        .length < 2
    ) {
      newErrors.nombre =
        t(
          "auth.nameMin"
        );
    }

    if (!formData.correo.trim()) {
      newErrors.correo =
        t(
          "auth.emailRequired"
        );
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.correo
      )
    ) {
      newErrors.correo =
        t(
          "auth.invalidEmail"
        );
    }

    if (!formData.password) {
      newErrors.password =
        t(
          "auth.passwordRequired"
        );
    } else if (
      formData.password.length <
      6
    ) {
      newErrors.password =
        t(
          "auth.passwordMin"
        );
    }

    if (
      !formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        t(
          "auth.confirmRequired"
        );
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        t(
          "auth.passwordsMismatch"
        );
    }

    setErrors(newErrors);

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const correo =
        formData.correo
          .trim()
          .toLowerCase();

      const users =
        await api.get(
          `/usuarios?correo=${encodeURIComponent(
            correo
          )}`
        );

      const existingUser =
        users.find(
          (user) =>
            user.correo.toLowerCase() ===
            correo
        );

      if (existingUser) {
        setErrors({
          correo:
            t(
              "auth.existingEmail"
            ),
        });

        return;
      }

      const newUser = {
        id: generateId(),
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
        title: t(
          "auth.accountCreated"
        ),
        text: t(
          "auth.accountCreatedText"
        ),
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Error al registrar usuario:",
        error
      );

      await Swal.fire({
        icon: "error",
        title: t(
          "auth.registerErrorTitle"
        ),
        text: t(
          "auth.registerError"
        ),
        confirmButtonText:
          t("auth.accept"),
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
            {t("auth.brand")}
          </p>

          <h1 id="register-title">
            {t(
              "auth.registerTitle"
            )}
          </h1>

          <p>
            {t(
              "auth.registerDescription"
            )}
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-field">
            <label htmlFor="nombre">
              {t("auth.name")}
            </label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              value={
                formData.nombre
              }
              onChange={
                handleChange
              }
              placeholder={t(
                "auth.namePlaceholder"
              )}
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
              {t("auth.email")}
            </label>

            <input
              id="correo"
              name="correo"
              type="email"
              value={
                formData.correo
              }
              onChange={
                handleChange
              }
              placeholder={t(
                "auth.emailPlaceholder"
              )}
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
              {t(
                "auth.password"
              )}
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder={t(
                "auth.passwordMinPlaceholder"
              )}
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
                {
                  errors.password
                }
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">
              {t(
                "auth.confirmPassword"
              )}
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={
                formData.confirmPassword
              }
              onChange={
                handleChange
              }
              placeholder={t(
                "auth.confirmPasswordPlaceholder"
              )}
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
                {
                  errors.confirmPassword
                }
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? t(
                  "auth.creatingAccount"
                )
              : t(
                  "auth.createButton"
                )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {t(
              "auth.alreadyAccount"
            )}
          </p>

          <Link to="/login">
            {t(
              "auth.accountLogin"
            )}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Register;