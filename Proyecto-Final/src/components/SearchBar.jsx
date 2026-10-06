import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Icon from "./Icon";
function SearchBar() {
  const navigate = useNavigate(); const { language } = useLanguage(); const [search, setSearch] = useState("");
  const submit = (event) => { event.preventDefault(); const value = search.trim(); navigate(value ? `/tours?search=${encodeURIComponent(value)}` : "/tours"); };
  return <form className="search-bar" onSubmit={submit} role="search"><label htmlFor="home-search" className="sr-only">{language === "en" ? "Search tours" : "Buscar tours"}</label><div className="search-bar-input"><Icon name="search" size={20} /><input id="home-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={language === "en" ? "What do you want to experience?" : "¿Qué experiencia quieres vivir?"} /></div><button type="submit">{language === "en" ? "Explore" : "Explorar"}</button></form>;
}
export default SearchBar;
