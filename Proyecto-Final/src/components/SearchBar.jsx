import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const value = search.trim();

    if (value) {
      navigate(
        `/tours?search=${encodeURIComponent(value)}`
      );
    } else {
      navigate("/tours");
    }
  }

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="search-input-wrapper">
        <span
          className="search-icon"
          aria-hidden="true"
        >
          🔎
        </span>

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="¿Qué experiencia estás buscando?"
          aria-label="Buscar experiencias turísticas"
        />
      </div>

      <button
        type="submit"
        className="search-button"
      >
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;