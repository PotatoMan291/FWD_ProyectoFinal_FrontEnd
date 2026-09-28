import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      navigate("/tours");
      return;
    }

    navigate(`/tours?search=${encodeURIComponent(searchValue)}`);
  };

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
    >
      <div className="search-field">
        <span
          className="search-icon"
          aria-hidden="true"
        >
          ⌕
        </span>

        <div className="search-field-content">
          <label htmlFor="tour-search">
            ¿Qué quieres explorar?
          </label>

          <input
            id="tour-search"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Ej. aventura, playa, naturaleza..."
          />
        </div>
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