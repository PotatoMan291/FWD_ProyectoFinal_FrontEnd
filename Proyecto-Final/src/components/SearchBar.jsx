import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Icon from "./Icon";

function SearchBar() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [search, setSearch] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      navigate("/tours");
      return;
    }

    navigate(`/tours?search=${encodeURIComponent(searchValue)}`);
  };

  const isEnglish = language === "en";

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-field">
        <span className="search-icon" aria-hidden="true">
          <Icon name="search" size={25} />
        </span>

        <div className="search-field-content">
          <label htmlFor="tour-search">
            {isEnglish ? "What do you want to explore?" : "¿Qué quieres explorar?"}
          </label>

          <input
            id="tour-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              isEnglish
                ? "E.g. adventure, beach, nature..."
                : "Ej. aventura, playa, naturaleza..."
            }
          />
        </div>
      </div>

      <button type="submit" className="search-button">
        {isEnglish ? "Search" : "Buscar"}
      </button>
    </form>
  );
}

export default SearchBar;
