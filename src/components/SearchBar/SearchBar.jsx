import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import "./SearchBar.scss";

const SearchBar = ({ placeholder, onSearch, value }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch("");
  };

  return (
    <div className="search-bar">
      <SearchIcon className="search-icon" />
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={handleChange}
        className="search-input"
      />
      {value && (
        <button className="clear-btn" onClick={handleClear}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
