import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Marketplace from "../pages/Marketplace";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import TourDetail from "../pages/TourDetail";

import PrivateRoute from "../components/PrivateRoute";
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
          RUTAS PRIVADAS
      ========================= */}

      <Route element={<PrivateRoute />}>
        {/*

        Las siguientes rutas se agregarán
        posteriormente.

        Ejemplo:

        <Route
          path="/perfil"
          element={<Profile />}
        />

        */}
      </Route>

      {/* =========================
          RUTAS POR ROL
      ========================= */}

      <Route
        element={
          <RoleRoute
            allowedRoles={["turista"]}
          />
        }
      >
        {/* Futuras rutas del turista */}
      </Route>

      <Route
        element={
          <RoleRoute
            allowedRoles={["operador"]}
          />
        }
      >
        {/* Futuras rutas del operador */}
      </Route>

      <Route
        element={
          <RoleRoute
            allowedRoles={["admin"]}
          />
        }
      >
        {/* Futuras rutas del administrador */}
      </Route>

      {/* =========================
          404
      ========================= */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;