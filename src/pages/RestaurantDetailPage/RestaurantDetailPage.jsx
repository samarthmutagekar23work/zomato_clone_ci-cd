import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MenuItem from "../../components/MenuItem/MenuItem";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { restaurants, menuItems, reviews } from "../../data/restaurantData";
import { useApp } from "../../context/AppContext";
import "./RestaurantDetailPage.scss";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useApp();
  const [activeTab, setActiveTab] = useState("menu");
  const [quantities, setQuantities] = useState({});

  const restaurant = restaurants.find((r) => r.id === parseInt(id));
  const restaurantMenu = menuItems[id] || [];
  const restaurantReviews = reviews[id] || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (restaurant) {
      document.title = `${restaurant.name} - Zomato`;
    }
  }, [id, restaurant]);

  if (!restaurant) {
    return (
      <div className="restaurant-detail-page">
        <Header />
        <div className="not-found">
          <h2>Restaurant not found</h2>
          <button className="btn-zomato" onClick={() => navigate("/restaurants")}>
            Back to Restaurants
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleQuantityChange = (itemId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    for (let i = 0; i < quantity; i++) {
      addToCart(item, restaurant.id, restaurant.name);
    }
    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
  };

  const cartItemCount = cart.filter((c) => c.restaurantId === restaurant.id).length;
  const cartTotal = cart
    .filter((c) => c.restaurantId === restaurant.id)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const groupedMenu = restaurantMenu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="restaurant-detail-page">
      <Header />

      <div className="restaurant-hero" style={{ backgroundImage: `url(${restaurant.image})` }}>
        <div className="hero-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowBackIcon /> Back
          </button>
        </div>
      </div>

      <div className="restaurant-info-bar">
        <div className="info-container">
          <h1>{restaurant.name}</h1>
          <div className="info-row">
            <span className="rating">
              <StarIcon className="star-icon" /> {restaurant.rating}
            </span>
            <span className="reviews">{restaurant.reviews}+ reviews</span>
            <span className="cuisine">{restaurant.cuisine}</span>
            <span className="price">₹{restaurant.price} for two</span>
          </div>
          <div className="info-row">
            <span className="delivery-time">
              <AccessTimeIcon /> {restaurant.deliveryTime} min
            </span>
            <span className="address">
              <LocationOnIcon /> {restaurant.address}
            </span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "menu" ? "active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          Menu
        </button>
        <button
          className={`tab ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({restaurantReviews.length})
        </button>
        <button
          className={`tab ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Info
        </button>
      </div>

      <div className="content-area">
        {activeTab === "menu" && (
          <div className="menu-section">
            {Object.keys(groupedMenu).map((category) => (
              <div key={category} className="menu-category">
                <h2>{category}</h2>
                <div className="menu-items">
                  {groupedMenu[category].map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      quantity={quantities[item.id] || 0}
                      onQuantityChange={handleQuantityChange}
                      onAdd={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="reviews-section">
            <h2>Customer Reviews</h2>
            {restaurantReviews.length > 0 ? (
              <div className="reviews-list">
                {restaurantReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="user-avatar">
                        {review.user.charAt(0)}
                      </div>
                      <div className="user-info">
                        <h4>{review.user}</h4>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <div className="review-rating">
                        <StarIcon className="star-icon" />
                        {review.rating}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-reviews">No reviews yet</p>
            )}
          </div>
        )}

        {activeTab === "info" && (
          <div className="info-section">
            <h2>Restaurant Info</h2>
            <div className="info-card">
              <div className="info-item">
                <h4>Address</h4>
                <p>{restaurant.address}, Belgaum</p>
              </div>
              <div className="info-item">
                <h4>Cuisine</h4>
                <p>{restaurant.cuisine}</p>
              </div>
              <div className="info-item">
                <h4>Average Cost</h4>
                <p>₹{restaurant.price} for two people</p>
              </div>
              <div className="info-item">
                <h4>Opening Hours</h4>
                <p>{restaurant.isOpen ? "Open Now - 11 AM to 11 PM" : "Closed"}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {cartItemCount > 0 && (
        <div className="cart-floating-bar">
          <div className="cart-info">
            <ShoppingCartIcon />
            <span>{cartItemCount} items</span>
            <span className="cart-total">₹{cartTotal}</span>
          </div>
          <button onClick={() => navigate("/cart")}>View Cart</button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RestaurantDetailPage;
