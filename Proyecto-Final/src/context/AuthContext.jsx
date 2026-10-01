import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const AUTH_STORAGE_KEY = "puravida_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error(
        "Error al restaurar la sesión:",
        error
      );

      localStorage.removeItem(AUTH_STORAGE_KEY);
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
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAuthenticated = Boolean(user);

  const hasRole = (role) => {
    return user?.rol === role;
  };

  const hasAnyRole = (roles = []) => {
    return roles.includes(user?.rol);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}