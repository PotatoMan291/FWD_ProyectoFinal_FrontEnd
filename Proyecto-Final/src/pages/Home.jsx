import { useEffect, useState } from "react";

import Button from "../components/Button";
import CategoryCard from "../components/CategoryCard";
import FeaturedTourCard from "../components/FeaturedTourCard";
import Icon from "../components/Icon";
import SearchBar from "../components/SearchBar";
import SectionTitle from "../components/SectionTitle";

import { getTours } from "../services/tourService";

const fallbackFeaturedTours = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80",
    category: "Naturaleza",
    title: "Caminata al Volcán Arenal",
    location: "Alajuela",
    price: 35000,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80",
    category: "Aventura",
    title: "Canopy y aventura en Monteverde",
    location: "Puntarenas",
    price: 42000,
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    category: "Playa",
    title: "Atardecer en Playa Tamarindo",
    location: "Guanacaste",
    price: 28000,
  },
];

const categories = [
  {
    icon: "leaf",
    title: "Naturaleza",
    description:
      "Bosques, volcanes y paisajes únicos.",
    search: "Naturaleza",
  },
  {
    icon: "mountain",
    title: "Aventura",
    description:
      "Experiencias para quienes buscan adrenalina.",
    search: "Aventura",
  },
  {
    icon: "wave",
    title: "Playa",
    description:
      "Descubre las costas y playas de Costa Rica.",
    search: "Playa",
  },
  {
    icon: "culture",
    title: "Cultura",
    description:
      "Conoce la historia y cultura local.",
    search: "Cultura",
  },
];

function normalizeFeaturedTour(tour) {
  return {
    id: tour.id,
    image: tour.imagen,
    category: tour.categoria,
    title: tour.nombre,
    location: tour.ubicacion,
    price: tour.precio,
  };
}

function Home() {
  const [featuredTours, setFeaturedTours] =
    useState(fallbackFeaturedTours);

  useEffect(() => {
    async function loadFeaturedTours() {
      try {
        const tours = await getTours();

        const normalizedTours = tours
          .slice(0, 3)
          .map(normalizeFeaturedTour);

        if (normalizedTours.length > 0) {
          setFeaturedTours(normalizedTours);
        }
      } catch (error) {
        console.error(
          "Error al cargar las experiencias destacadas:",
          error
        );
      }
    }

    loadFeaturedTours();
  }, []);

  return (
    <main>
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source
            src="/videos/costa-rica.mp4"
            type="video/mp4"
          />

          <source
            src="/videos/costa-rica.webm"
            type="video/webm"
          />
        </video>

        <div
          className="hero-background"
          aria-hidden="true"
        />

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
              Encuentra, compara y reserva tours y
              experiencias turísticas pensadas para que
              vivas Costa Rica.
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
                key={tour.id}
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
              Costa Rica tiene una experiencia esperándote.
            </h2>

            <p>
              Explora nuevos lugares, apoya experiencias
              locales y crea recuerdos que duren para
              siempre.
            </p>

            <Button to="/tours">
              Explorar experiencias
            </Button>
          </div>

          <div
            className="experience-decoration"
            aria-hidden="true"
          >
            <Icon name="compass" size={112} />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <p className="section-eyebrow">
            PURAVIDA TRIPS
          </p>

          <h2>
            Tu próxima aventura comienza aquí.
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