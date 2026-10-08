import React, { useState } from "react";
import { Search, X } from "lucide-react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");

    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <Search className="search-icon" size={20} />

      <input
        type="text"
        placeholder="Search spices, masalas, recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;