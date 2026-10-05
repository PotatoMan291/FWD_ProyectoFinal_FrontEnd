import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

import Icon from "./Icon";

function SearchBar() {
  const [search, setSearch] =
    useState("");

  const navigate = useNavigate();

  const { t } = useLanguage();

  const handleSubmit = (event) => {
    event.preventDefault();

    const searchValue =
      search.trim();

    if (!searchValue) {
      navigate("/tours");
      return;
    }

    navigate(
      `/tours?search=${encodeURIComponent(
        searchValue
      )}`
    );
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
          <Icon
            name="search"
            size={24}
          />
        </span>

        <div className="search-field-content">
          <label htmlFor="tour-search">
            {t("search.label")}
          </label>

          <input
            id="tour-search"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder={t(
              "search.placeholder"
            )}
          />
        </div>
      </div>

      <button
        type="submit"
        className="search-button"
      >
        {t("search.button")}
      </button>
    </form>
  );
}

export default SearchBar;