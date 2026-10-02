import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext();

const AUTH_STORAGE_KEY = "puravida_auth";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem(AUTH_STORAGE_KEY);

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        if (
          parsedUser?.id &&
          parsedUser?.correo &&
          parsedUser?.rol
        ) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem(
            AUTH_STORAGE_KEY
          );
        }
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

  const login = (userData) => {
    const sessionUser = {
      id: userData.id,
      nombre: userData.nombre,
      correo: userData.correo,
      rol: userData.rol,
    };

    setUser(sessionUser);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(sessionUser)
    );

    return sessionUser;
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem(
      AUTH_STORAGE_KEY
    );
  };

  const hasRole = (role) => {
    return user?.rol === role;
  };

  const hasAnyRole = (roles) => {
    return user
      ? roles.includes(user.rol)
      : false;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasRole,
      hasAnyRole,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
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