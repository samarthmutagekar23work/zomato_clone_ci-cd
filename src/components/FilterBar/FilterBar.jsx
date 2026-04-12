import React from "react";
import StarIcon from "@mui/icons-material/Star";
import "./FilterBar.scss";

const FilterBar = ({ cuisines, filters, onFilterChange, onReset }) => {
  const ratingOptions = [
    { value: 0, label: "All" },
    { value: 3, label: "3+" },
    { value: 3.5, label: "3.5+" },
    { value: 4, label: "4+" },
    { value: 4.5, label: "4.5+" },
  ];

  const sortOptions = [
    { value: "rating", label: "Rating" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "delivery", label: "Fastest Delivery" },
  ];

  const priceRanges = [
    { min: 0, max: 1000, label: "All" },
    { min: 0, max: 300, label: "Under ₹300" },
    { min: 300, max: 500, label: "₹300 - ₹500" },
    { min: 500, max: 700, label: "₹500 - ₹700" },
    { min: 700, max: 1000, label: "₹700+" },
  ];

  const handleRatingChange = (value) => {
    onFilterChange({ rating: value });
  };

  const handleCuisineChange = (e) => {
    onFilterChange({ cuisine: e.target.value || "" });
  };

  const handlePriceChange = (range) => {
    onFilterChange({ priceRange: [range.min, range.max] });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const activeFiltersCount =
    (filters.rating > 0 ? 1 : 0) +
    (filters.cuisine ? 1 : 0) +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000 ? 1 : 0);

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Sort By</label>
        <select value={filters.sortBy} onChange={handleSortChange}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Rating</label>
        <div className="rating-buttons">
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              className={`rating-btn ${filters.rating === option.value ? "active" : ""}`}
              onClick={() => handleRatingChange(option.value)}
            >
              {option.value === 0 ? (
                option.label
              ) : (
                <>
                  <StarIcon className="star-icon" />
                  {option.label}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Cuisine</label>
        <select value={filters.cuisine} onChange={handleCuisineChange}>
          <option value="">All Cuisines</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <div className="price-buttons">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              className={`price-btn ${
                filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                  ? "active"
                  : ""
              }`}
              onClick={() => handlePriceChange(range)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button className="clear-filters-btn" onClick={onReset}>
          Clear All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );
};

export default FilterBar;
