import { useEffect, useState } from "react";

import Button from "../components/Button";
import CategoryCard from "../components/CategoryCard";
import FeaturedTourCard from "../components/FeaturedTourCard";
import Icon from "../components/Icon";
import SearchBar from "../components/SearchBar";
import SectionTitle from "../components/SectionTitle";

import {
  useLanguage,
} from "../context/LanguageContext";

import { getTours } from "../services/tourService";

const fallbackFeaturedTours = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80",
    category: "Naturaleza",
    title:
      "Caminata al Volcán Arenal",
    location: "Alajuela",
    price: 35000,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80",
    category: "Aventura",
    title:
      "Canopy y aventura en Monteverde",
    location: "Puntarenas",
    price: 42000,
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    category: "Playa",
    title:
      "Atardecer en Playa Tamarindo",
    location: "Guanacaste",
    price: 28000,
  },
];

function normalizeFeaturedTour(
  tour
) {
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
    useState(
      fallbackFeaturedTours
    );

  const {
    t,
    language,
  } = useLanguage();

  useEffect(() => {
    async function loadFeaturedTours() {
      try {
        const tours =
          await getTours();

        const normalizedTours =
          tours
            .slice(0, 3)
            .map(
              normalizeFeaturedTour
            );

        if (
          normalizedTours.length >
          0
        ) {
          setFeaturedTours(
            normalizedTours
          );
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

  const categories = [
    {
      icon: "leaf",
      title: t(
        "home.categories.nature.title"
      ),
      description: t(
        "home.categories.nature.description"
      ),
      search: "Naturaleza",
    },
    {
      icon: "mountain",
      title: t(
        "home.categories.adventure.title"
      ),
      description: t(
        "home.categories.adventure.description"
      ),
      search: "Aventura",
    },
    {
      icon: "wave",
      title: t(
        "home.categories.beach.title"
      ),
      description: t(
        "home.categories.beach.description"
      ),
      search: "Playa",
    },
    {
      icon: "culture",
      title: t(
        "home.categories.culture.title"
      ),
      description: t(
        "home.categories.culture.description"
      ),
      search: "Cultura",
    },
  ];

  return (
    <main>
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source
            src="/videos/costa-rica.mp4"
            type="video/mp4"
          />
        </video>

        <div
          className="hero-background"
          aria-hidden="true"
        />

        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-eyebrow">
              {t("home.eyebrow")}
            </p>

            <h1>
              {t("home.title")}
              <span>
                {t("home.titleAccent")}
              </span>
            </h1>

            <p className="hero-description">
              {t("home.description")}
            </p>

            <SearchBar />
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="content-container">
          <SectionTitle
            eyebrow={t(
              "home.exploreEyebrow"
            )}
            title={t(
              "home.exploreTitle"
            )}
            description={t(
              "home.exploreDescription"
            )}
          />

          <div className="categories-grid">
            {categories.map(
              (category) => (
                <CategoryCard
                  key={
                    category.title
                  }
                  {...category}
                />
              )
            )}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="content-container">
          <div className="section-header-row">
            <SectionTitle
              eyebrow={t(
                "home.featuredEyebrow"
              )}
              title={t(
                "home.featuredTitle"
              )}
              description={t(
                "home.featuredDescription"
              )}
            />

            <Button
              to="/tours"
              variant="outline"
            >
              {t(
                "home.allTours"
              )}
            </Button>
          </div>

          <div className="featured-grid">
            {featuredTours.map(
              (tour) => (
                <FeaturedTourCard
                  key={tour.id}
                  {...tour}
                />
              )
            )}
          </div>
        </div>
      </section>

      <section className="experience-banner">
        <div className="experience-banner-container">
          <div>
            <p className="section-eyebrow">
              {t(
                "home.adventureEyebrow"
              )}
            </p>

            <h2>
              {t(
                "home.adventureTitle"
              )}
            </h2>

            <p>
              {t(
                "home.adventureDescription"
              )}
            </p>

            <Button to="/tours">
              {t(
                "home.exploreExperiences"
              )}
            </Button>
          </div>

          <div
            className="experience-decoration"
            aria-hidden="true"
          >
            <Icon
              name="compass"
              size={112}
            />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <p className="section-eyebrow">
            {t("home.ctaEyebrow")}
          </p>

          <h2>
            {t("home.ctaTitle")}
          </h2>

          <p>
            {t(
              "home.ctaDescription"
            )}
          </p>

          <Button to="/tours">
            {t(
              "home.startExploring"
            )}
          </Button>
        </div>
      </section>
    </main>
  );
}

export default Home;