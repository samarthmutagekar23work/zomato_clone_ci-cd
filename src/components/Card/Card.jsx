import React from "react";
import "./Card.scss";
import Dine from "../../assets/images/Dine-Out.png";
import Night from "../../assets/images/Night-Life.png";
import Online from "../../assets/images/Online-Food.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Card = () => {
  const cards = [
    {
      image: Online,
      title: "Order Online",
      description: "Stay home and order to your doorstep",
      icon: "🛵",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      image: Night,
      title: "Nightlife & Clubs",
      description: "Explore the city's top nightlife outlets",
      icon: "🌙",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      image: Dine,
      title: "Dining Out",
      description: "View the city's favourite venues",
      icon: "🍽️",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  return (
    <div className="card-section">
      <div className="section-header">
        <h2 className="section-title">What's on your mind?</h2>
        <p className="section-subtitle">Explore curated options for every craving</p>
      </div>
      <div className="card">
        {cards.map((card, index) => (
          <div 
            className="cardImg section-animate" 
            key={card.title}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="card-image-wrapper">
              <img src={card.image} alt={card.title} />
              <div className="card-overlay" style={{ background: card.gradient }}></div>
              <div className="card-icon">{card.icon}</div>
            </div>
            <div className="card-content">
              <h1>{card.title}</h1>
              <span>{card.description}</span>
              <div className="card-action">
                <span>Explore</span>
                <ArrowForwardIcon className="arrow-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
