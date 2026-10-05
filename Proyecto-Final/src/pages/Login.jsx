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
import {
  useAuth,
} from "../context/AuthContext";

import {
  useLanguage,
} from "../context/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const location =
    useLocation();

  const { login } =
    useAuth();

  const { t } =
    useLanguage();

  const [formData, setFormData] =
    useState({
      correo: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

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

      const foundUser =
        users.find(
          (user) =>
            user.correo
              .toLowerCase() ===
              correo &&
            user.password ===
              formData.password
        );

      if (!foundUser) {
        await Swal.fire({
          icon: "error",
          title: t(
            "auth.invalidCredentialsTitle"
          ),
          text: t(
            "auth.invalidCredentials"
          ),
          confirmButtonText:
            t("auth.accept"),
          confirmButtonColor:
            "#176a4e",
        });

        return;
      }

      const sessionUser =
        login(foundUser);

      const redirectPath =
        location.state?.from?.pathname ||
        (sessionUser?.rol ===
        "admin"
          ? "/admin"
          : sessionUser?.rol ===
            "operador"
          ? "/operador"
          : "/turista");

      navigate(
        redirectPath,
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
        title: t(
          "auth.serverErrorTitle"
        ),
        text: t(
          "auth.serverError"
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
        className="auth-card"
        aria-labelledby="login-title"
      >
        <div className="auth-header">
          <p className="section-eyebrow">
            {t("auth.brand")}
          </p>

          <h1 id="login-title">
            {t(
              "auth.loginTitle"
            )}
          </h1>

          <p>
            {t(
              "auth.loginDescription"
            )}
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >
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
                  ? "login-correo-error"
                  : undefined
              }
            />

            {errors.correo && (
              <span
                id="login-correo-error"
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
                "auth.passwordPlaceholder"
              )}
              autoComplete="current-password"
              aria-invalid={Boolean(
                errors.password
              )}
              aria-describedby={
                errors.password
                  ? "login-password-error"
                  : undefined
              }
            />

            {errors.password && (
              <span
                id="login-password-error"
                className="form-error"
              >
                {
                  errors.password
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
                  "auth.loggingIn"
                )
              : t(
                  "auth.loginButton"
                )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {t(
              "auth.noAccount"
            )}
          </p>

          <Link to="/register">
            {t(
              "auth.createAccount"
            )}
          </Link>
        </div>

        <div className="auth-demo">
          <p>
            <strong>
              {t(
                "auth.demoTitle"
              )}
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