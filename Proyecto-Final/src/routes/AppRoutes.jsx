import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Marketplace from "../pages/Marketplace";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";
import TourDetail from "../pages/TourDetail";
import RoleDashboard from "../pages/RoleDashboard";

import GuestRoute from "../components/GuestRoute";
import RoleRoute from "../components/RoleRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          RUTAS PÚBLICAS
      ========================= */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/tours"
        element={<Marketplace />}
      />

      <Route
        path="/tours/:id"
        element={<TourDetail />}
      />

      {/* =========================
          RUTAS PARA INVITADOS
      ========================= */}

      <Route element={<GuestRoute />}>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
      </Route>

      {/* =========================
          TURISTA
      ========================= */}

      <Route
        element={
          <RoleRoute
            allowedRoles={["turista"]}
          />
        }
      >
        <Route
          path="/turista"
          element={
            <RoleDashboard role="turista" />
          }
        />
      </Route>

      {/* =========================
          OPERADOR
      ========================= */}

      <Route
        element={
          <RoleRoute
            allowedRoles={["operador"]}
          />
        }
      >
        <Route
          path="/operador"
          element={
            <RoleDashboard role="operador" />
          }
        />
      </Route>

      {/* =========================
          ADMINISTRADOR
      ========================= */}

      <Route
        element={
          <RoleRoute
            allowedRoles={["admin"]}
          />
        }
      >
        <Route
          path="/admin"
          element={
            <RoleDashboard role="admin" />
          }
        />
      </Route>

      {/* =========================
          403 / 404
      ========================= */}

      <Route
        path="/403"
        element={<Forbidden />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;