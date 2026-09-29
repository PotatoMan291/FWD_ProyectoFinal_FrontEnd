import { useEffect, useState } from "react";

import Button from "../components/Button";
import CategoryCard from "../components/CategoryCard";
import FeaturedTourCard from "../components/FeaturedTourCard";
import SearchBar from "../components/SearchBar";
import SectionTitle from "../components/SectionTitle";
import { getTours } from "../services/tourService";

const fallbackFeaturedTours = [
  {
    category: "Naturaleza",
    title: "Experiencias entre naturaleza",
    location: "Costa Rica",
    price: 25000,
  },
  {
    category: "Aventura",
    title: "Aventura y adrenalina",
    location: "Costa Rica",
    price: 35000,
  },
  {
    category: "Playa",
    title: "Escapada tropical",
    location: "Costa Rica",
    price: 30000,
  },
];

const categories = [
  {
    icon: "🌿",
    title: "Naturaleza",
    description:
      "Bosques, volcanes y paisajes únicos.",
    search: "Naturaleza",
  },
  {
    icon: "🏄",
    title: "Aventura",
    description:
      "Experiencias para quienes buscan adrenalina.",
    search: "Aventura",
  },
  {
    icon: "🌊",
    title: "Playa",
    description:
      "Descubre las costas y playas de Costa Rica.",
    search: "Playa",
  },
  {
    icon: "🏛️",
    title: "Cultura",
    description:
      "Conoce la historia y cultura local.",
    search: "Cultura",
  },
];

function Home() {
  const [featuredTours, setFeaturedTours] = useState(
    fallbackFeaturedTours
  );

  useEffect(() => {
    async function loadFeaturedTours() {
      try {
        const tours = await getTours();
        setFeaturedTours(tours.slice(0, 3));
      } catch (error) {
        console.error("Error al cargar las experiencias destacadas:", error);
      }
    }

    loadFeaturedTours();
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-background" />

        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-eyebrow">
              COSTA RICA · EXPERIENCIAS · PURA VIDA
            </p>

            <h1>
              Descubre Costa Rica
              <span> a tu manera.</span>
            </h1>

            <p className="hero-description">
              Encuentra, compara y reserva tours y experiencias
              turísticas pensadas para que vivas Costa Rica.
            </p>

            <SearchBar />
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="content-container">
          <SectionTitle
            eyebrow="EXPLORA"
            title="Encuentra tu próxima experiencia"
            description="Explora diferentes formas de conocer y disfrutar Costa Rica."
          />

          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.title}
                {...category}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="content-container">
          <div className="section-header-row">
            <SectionTitle
              eyebrow="EXPERIENCIAS DESTACADAS"
              title="Vive algo diferente"
              description="Descubre algunas de las experiencias que podrás encontrar en PuraVida Trips."
            />

            <Button
              to="/tours"
              variant="outline"
            >
              Ver todos los tours
            </Button>
          </div>

          <div className="featured-grid">
            {featuredTours.map((tour) => (
              <FeaturedTourCard
                key={tour.title}
                {...tour}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="experience-banner">
        <div className="experience-banner-container">
          <div>
            <p className="section-eyebrow">
              TU PRÓXIMA AVENTURA
            </p>

            <h2>
              Costa Rica tiene una experiencia
              esperándote.
            </h2>

            <p>
              Explora nuevos lugares, apoya experiencias
              locales y crea recuerdos que duren para siempre.
            </p>

            <Button to="/tours">
              Explorar experiencias
            </Button>
          </div>

          <div
            className="experience-decoration"
            aria-hidden="true"
          >
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <p className="section-eyebrow">
            PURAVIDA TRIPS
          </p>

          <h2>
            Tu próxima aventura
            comienza aquí.
          </h2>

          <p>
            Explora experiencias turísticas en Costa Rica
            y encuentra una que se adapte a ti.
          </p>

          <Button to="/tours">
            Comenzar a explorar
          </Button>
        </div>
      </section>
    </main>
  );
}

export default Home;