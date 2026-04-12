import React from "react";
import "./Cities.scss";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Cities = () => {
  const cityData = [
    { name: "Bodakdev", places: 345 },
    { name: "Satellite", places: 336 },
    { name: "Gurukul", places: 83 },
    { name: "Navrangpura", places: 302 },
    { name: "Vastrapur", places: 217 },
    { name: "Thaltej", places: 222 },
    { name: "Prahlad Nagar", places: 181 },
    { name: "C G Road", places: 94 },
  ];

  return (
    <div className="cities">
      <div className="cities-header">
        <h1>
          Popular localities in and around <span className="highlight">Ahmedabad</span>
        </h1>
      </div>
      <div className="cityContainer">
        {cityData.map((city) => (
          <div className="city" key={city.name}>
            <div className="cityLeft">
              <LocationOnIcon className="location-icon" />
              <div className="city-info">
                <h3>{city.name}</h3>
                <span>{city.places} Places</span>
              </div>
            </div>
            <div className="icon">
              <ChevronRightIcon />
            </div>
          </div>
        ))}
        <div className="city see-more">
          <div className="cityLeft">
            <h3>See more</h3>
          </div>
          <div className="icon">
            <KeyboardArrowDownIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
