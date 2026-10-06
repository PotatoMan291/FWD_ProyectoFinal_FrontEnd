import { useEffect, useState } from "react";
import Button from "../components/Button";
import CategoryCard from "../components/CategoryCard";
import FeaturedTourCard from "../components/FeaturedTourCard";
import Icon from "../components/Icon";
import SearchBar from "../components/SearchBar";
import SectionTitle from "../components/SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import { getTours } from "../services/tourService";

const HERO_VIDEO_URL = import.meta.env.VITE_CLOUDINARY_HERO_VIDEO_URL || "/videos/costa-rica.mp4";
const fallbackFeaturedTours = [
  { id: "1", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80", category: "Naturaleza", title: "Caminata al Volcán Arenal", location: "Alajuela", price: 35000 },
  { id: "2", image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80", category: "Aventura", title: "Canopy y aventura en Monteverde", location: "Puntarenas", price: 42000 },
  { id: "3", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80", category: "Playa", title: "Atardecer en Playa Tamarindo", location: "Guanacaste", price: 28000 }
];

function Home() {
  const { t } = useLanguage();
  const [featuredTours, setFeaturedTours] = useState(fallbackFeaturedTours);
  useEffect(() => { getTours().then((tours) => tours.length && setFeaturedTours(tours.slice(0,3).map((tour) => ({ id: tour.id, image: tour.imagen, category: tour.categoria, title: tour.nombre, location: tour.ubicacion, price: tour.precio })))).catch((error) => console.error(error)); }, []);
  const translatedFeaturedTours = featuredTours.map((tour) => {
    if (t("home.title") === "Discover Costa Rica") {
      const names = { "1": "Arenal Volcano Hike", "2": "Monteverde Canopy Adventure", "3": "Tamarindo Beach Sunset" };
      const categoriesEn = { "Naturaleza": "Nature", "Aventura": "Adventure", "Playa": "Beach", "Cultura": "Culture" };
      return { ...tour, title: names[String(tour.id)] || tour.title, category: categoriesEn[tour.category] || tour.category };
    }
    return tour;
  });
  const categories = [
    { icon: "leaf", title: t("home.categories.nature"), description: t("home.categoryDescriptions.nature"), search: "Naturaleza" },
    { icon: "mountain", title: t("home.categories.adventure"), description: t("home.categoryDescriptions.adventure"), search: "Aventura" },
    { icon: "wave", title: t("home.categories.beach"), description: t("home.categoryDescriptions.beach"), search: "Playa" },
    { icon: "culture", title: t("home.categories.culture"), description: t("home.categoryDescriptions.culture"), search: "Cultura" }
  ];
  return <main>
    <section className="hero"><video className="hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src={HERO_VIDEO_URL} type="video/mp4" />{!import.meta.env.VITE_CLOUDINARY_HERO_VIDEO_URL && <source src="/videos/costa-rica.webm" type="video/webm" />}</video><div className="hero-background" aria-hidden="true" /><div className="hero-container"><div className="hero-content"><p className="hero-eyebrow">{t("home.eyebrow")}</p><h1>{t("home.title")}<span>{t("home.titleAccent")}</span></h1><p className="hero-description">{t("home.description")}</p><SearchBar /></div></div></section>
    <section className="categories-section"><div className="content-container"><SectionTitle eyebrow={t("home.explore")} title={t("home.featured")} description={t("home.differentDescription")} /><div className="categories-grid">{categories.map((category) => <CategoryCard key={category.search} {...category} />)}</div></div></section>
    <section className="featured-section"><div className="content-container"><div className="section-header-row"><SectionTitle eyebrow={t("home.featured")} title={t("home.different")} description={t("home.differentDescription")} /><Button to="/tours" variant="outline">{t("home.seeAll")}</Button></div><div className="featured-grid">{translatedFeaturedTours.map((tour) => <FeaturedTourCard key={tour.id} {...tour} />)}</div></div></section>
    <section className="experience-banner"><div className="experience-banner-container"><div><p className="section-eyebrow">{t("home.bannerEyebrow")}</p><h2>{t("home.bannerTitle")}</h2><p>{t("home.bannerText")}</p><Button to="/tours">{t("home.bannerButton")}</Button></div><div className="experience-decoration" aria-hidden="true"><Icon name="compass" size={112} /></div></div></section>
    <section className="cta-section"><div className="cta-container"><p className="section-eyebrow">PURAVIDA TRIPS</p><h2>{t("home.bannerTitle")}</h2><p>{t("home.description")}</p><Button to="/tours">{t("home.bannerButton")}</Button></div></section>
  </main>;
}
export default Home;
