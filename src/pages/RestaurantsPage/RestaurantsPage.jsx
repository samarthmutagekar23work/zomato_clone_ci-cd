import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import FilterBar from "../../components/FilterBar/FilterBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import { restaurants, cuisines } from "../../data/restaurantData";
import { useApp } from "../../context/AppContext";
import "./RestaurantsPage.scss";

const RestaurantsPage = () => {
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters, searchQuery, setSearchQuery } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query)
      );
    }

    if (filters.rating > 0) {
      result = result.filter((r) => r.rating >= filters.rating);
    }

    if (filters.cuisine) {
      result = result.filter((r) => r.cuisine === filters.cuisine);
    }

    if (filters.priceRange) {
      result = result.filter(
        (r) =>
          r.price >= filters.priceRange[0] && r.price <= filters.priceRange[1]
      );
    }

    switch (filters.sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "delivery":
        result.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split("-")[0]);
          const bTime = parseInt(b.deliveryTime.split("-")[0]);
          return aTime - bTime;
        });
        break;
      default:
        break;
    }

    return result;
  }, [filters, searchQuery]);

  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="restaurants-page">
      <Header />

      <div className="page-content">
        <div className="page-header">
          <h1>Restaurants in Belgaum</h1>
          <p>{filteredRestaurants.length} places</p>
        </div>

        <div className="controls-bar">
          <SearchBar
            placeholder="Search restaurants or cuisines..."
            onSearch={handleSearch}
            value={searchQuery}
          />
          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <FilterBar
            cuisines={cuisines}
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
          />
        )}

        <div className="restaurants-grid">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => handleRestaurantClick(restaurant.id)}
              />
            ))
          ) : (
            <div className="no-results">
              <h3>No restaurants found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="btn-zomato" onClick={resetFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantsPage;
