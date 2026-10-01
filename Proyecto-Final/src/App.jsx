import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AccessibilityPanel from "./components/AccessibilityPanel";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <Navbar />

      <AppRoutes />

      <Footer />

      <AccessibilityPanel />
    </>
  );
}

export default App;