import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cities } from "../../data/restaurantData";
import { useApp } from "../../context/AppContext";
import "./CitySelection.scss";

const CitySelection = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { setCity } = useApp();

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setCity(cityName);
    setShowDropdown(false);
    setSearchTerm("");
  };

  const handleContinue = () => {
    if (selectedCity) {
      navigate("/home");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filteredCities.length > 0) {
      handleCitySelect(filteredCities[0].name);
    }
  };

  return (
    <div className="city-selection">
      <div className="city-selection-overlay"></div>
      <div className="city-selection-content">
        <div className="logo-section">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Zomato_logo.svg/2560px-Zomato_logo.svg.png"
            alt="Zomato"
            className="zomato-logo"
          />
          <h1>Discover the best food & drinks</h1>
        </div>

        <div className="city-selector">
          <label>Select your city</label>
          <div className="search-container">
            <div className="location-icon">📍</div>
            <input
              type="text"
              placeholder="Search for city..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onKeyPress={handleKeyPress}
              className="city-search-input"
            />
          </div>

          {showDropdown && searchTerm && (
            <div className="city-dropdown">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <div
                    key={city.id}
                    className="city-option"
                    onClick={() => handleCitySelect(city.name)}
                  >
                    <span className="city-name">{city.name}</span>
                    <span className="city-state">{city.state}</span>
                  </div>
                ))
              ) : (
                <div className="no-results">No cities found</div>
              )}
            </div>
          )}

          {selectedCity && (
            <div className="selected-city">
              <span>📍 {selectedCity}</span>
            </div>
          )}

          <button
            className="continue-btn btn-zomato"
            onClick={handleContinue}
            disabled={!selectedCity}
          >
            Continue
          </button>
        </div>

        <div className="popular-cities">
          <h3>Popular Cities</h3>
          <div className="city-chips">
            {cities.slice(0, 6).map((city) => (
              <button
                key={city.id}
                className={`city-chip ${selectedCity === city.name ? "active" : ""}`}
                onClick={() => handleCitySelect(city.name)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelection;
