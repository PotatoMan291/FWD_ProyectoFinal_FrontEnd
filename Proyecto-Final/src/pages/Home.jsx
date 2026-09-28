import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="hero">
        <p className="hero-label">COSTA RICA · EXPERIENCIAS · AVENTURA</p>

        <h1>
          Descubre tu próxima
          <span> experiencia en Costa Rica</span>
        </h1>

        <p className="hero-description">
          Encuentra tours y experiencias turísticas, compara opciones
          y descubre nuevos lugares para vivir Costa Rica.
        </p>

        <div className="hero-actions">
          <Link to="/tours" className="button button-primary">
            Explorar tours
          </Link>
        </div>
      </section>

      <section className="home-section">
        <p className="section-label">EXPLORA</p>

        <h2>Experiencias para cada aventura</h2>

        <p>
          Muy pronto podrás explorar diferentes categorías de tours
          y experiencias disponibles en Costa Rica.
        </p>
      </section>
    </main>
  );
}

export default Home;