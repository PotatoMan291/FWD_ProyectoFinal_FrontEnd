import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext =
  createContext(null);

const AUTH_STORAGE_KEY =
  "puravida_auth";

function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem(
          AUTH_STORAGE_KEY
        );

      if (savedUser) {
        setUser(
          JSON.parse(savedUser)
        );
      }
    } catch (error) {
      console.error(
        "Error al restaurar la sesión:",
        error
      );

      localStorage.removeItem(
        AUTH_STORAGE_KEY
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    (userData) => {
      const sessionUser = {
        id: userData.id,
        nombre: userData.nombre,
        correo: userData.correo,
        rol: userData.rol,
      };

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(
          sessionUser
        )
      );

      setUser(sessionUser);

      return sessionUser;
    },
    []
  );

  const logout = useCallback(
    () => {
      localStorage.removeItem(
        AUTH_STORAGE_KEY
      );

      setUser(null);
    },
    []
  );

  const isAuthenticated =
    Boolean(user);

  const hasRole = useCallback(
    (role) =>
      user?.rol === role,
    [user]
  );

  const hasAnyRole =
    useCallback(
      (roles) =>
        roles.includes(user?.rol),
      [user]
    );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      hasRole,
      hasAnyRole,
    }),
    [
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      hasRole,
      hasAnyRole,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}

export default AuthProvider;