import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Marketplace from "../pages/Marketplace";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/tours"
        element={<Marketplace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;