import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Card/Card";
import Collection from "../../components/Collections/Collection";
import Cities from "../../components/Cities/Cities";
import CTA from "../../components/CTA/CTA";
import AccContainer from "../../components/AccContainer/AccContainer";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import { restaurants } from "../../data/restaurantData";
import "./HomePage.scss";

const HomePage = () => {
  const navigate = useNavigate();
  const featuredRestaurants = restaurants.filter((r) => r.featured).slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  const handleViewAll = () => {
    navigate("/restaurants");
  };

  return (
    <div className="home-page">
      <Header />
      
      <section className="categories-section">
        <Card />
      </section>

      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Restaurants</h2>
            <button className="view-all-btn" onClick={handleViewAll}>
              View All →
            </button>
          </div>
          <div className="restaurant-grid">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => handleRestaurantClick(restaurant.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="collections-section">
        <Collection />
      </section>

      <section className="cities-section">
        <Cities />
      </section>

      <section className="app-promo-section">
        <CTA />
      </section>

      <section className="faq-section">
        <AccContainer />
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
