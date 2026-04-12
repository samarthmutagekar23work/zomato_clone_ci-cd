import React from "react";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./RestaurantCard.scss";

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div className="restaurant-card" onClick={onClick}>
      <div className="card-image">
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="card-overlay"></div>
        {restaurant.featured && <div className="featured-badge">Featured</div>}
        {!restaurant.isOpen && (
          <div className="closed-badge">Currently Closed</div>
        )}
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <div className="rating">
            <StarIcon className="star-icon" />
            <span>{restaurant.rating}</span>
          </div>
        </div>
        <div className="restaurant-info">
          <p className="cuisine">{restaurant.cuisine}</p>
          <p className="price">₹{restaurant.price} for two</p>
        </div>
        <div className="delivery-info">
          <AccessTimeIcon className="time-icon" />
          <span>{restaurant.deliveryTime} min</span>
        </div>
        <div className="address">{restaurant.address}</div>
      </div>
    </div>
  );
};

export default RestaurantCard;
