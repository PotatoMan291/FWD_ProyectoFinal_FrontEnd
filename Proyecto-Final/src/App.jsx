import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <svg
        className="accessibility-filter-definitions"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id="pv-protanopia"
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"
            />
          </filter>

          <filter
            id="pv-deuteranopia"
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0 0.700 0.300 0 0 0 0 0.300 0.700 0 0 0 0 0 1 0"
            />
          </filter>

          <filter
            id="pv-tritanopia"
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              type="matrix"
              values="0.950 0.050 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <Navbar />

      <AppRoutes />

      <Footer />
    </>
  );
}

export default App;