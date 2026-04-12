import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";
import Logo from "../../assets/images/Zomato-Logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import blackLogo from "../../assets/images/blackLogo.webp";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { CSSTransition } from "react-transition-group";
import { useApp } from "../../context/AppContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { city, getCartItemCount, setSearchQuery: setContextSearchQuery } = useApp();
  const cartCount = getCartItemCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setContextSearchQuery(searchQuery);
      navigate("/restaurants");
    }
  };

  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <div className="header">
      <div className="header-overlay"></div>
      <nav className="header-nav">
        <span className="nav-link get-app">Get the App</span>
        <div className="right">
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
          <Link to="/cart" className="nav-link cart-link">
            <ShoppingCartIcon />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <span className="nav-link">Investor Relations</span>
          <span className="nav-link">Add restaurant</span>
          <span className="nav-link">Log in</span>
          <button className="btn-zomato nav-btn">Sign up</button>
        </div>
      </nav>
      <div className="hamburger" onClick={() => setOpen(!open)}>
        {open ? <CloseIcon style={{ color: "white", fontSize: "32px" }} /> : <MenuIcon style={{ fontSize: "32px" }} />}
      </div>
      <CSSTransition in={open} timeout={300} classNames="slide" unmountOnExit>
        <div className="sideMenu">
          <img src={blackLogo} alt="logo" className="side-logo" />
          <div className="innerMenu">
            <Link to="/home" className="menu-item" onClick={() => setOpen(false)}>
              <HomeIcon /> Home
            </Link>
            <Link to="/restaurants" className="menu-item" onClick={() => setOpen(false)}>
              <RestaurantIcon /> Restaurants
            </Link>
            <Link to="/cart" className="menu-item" onClick={() => setOpen(false)}>
              <ShoppingCartIcon /> Cart ({cartCount})
            </Link>
            <span className="menu-item">Investor Relations</span>
            <span className="menu-item">Add restaurants</span>
            <span className="menu-item">Log In</span>
            <span className="menu-item">Sign Up</span>
          </div>
        </div>
      </CSSTransition>
      <div className="headerContent">
        <img src={Logo} alt="logo" className="hero-logo animate-float" />
        <h3 className="hero-title animate-fade-in-up">
          Discover the best food & drinks in {city || "Belgaum"}
        </h3>
        <form className={`input-container ${searchFocused ? 'focused' : ''}`} onSubmit={handleSearch}>
          <div className="location-select">
            <span className="location-icon">📍</span>
            <select name="" id="">
              <option value="Belgaum">Belgaum</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
          <div className="divider"></div>
          <div className="search-input">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search for restaurant, cuisine or a dish"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
          <button type="submit" className="search-btn">
            <SearchIcon />
          </button>
        </form>
        <div className="quick-tags">
          <span className="tag" onClick={() => { setSearchQuery("Pizza"); setContextSearchQuery("Pizza"); navigate("/restaurants"); }}>
            🍕 Pizza
          </span>
          <span className="tag" onClick={() => { setSearchQuery("Burger"); setContextSearchQuery("Burger"); navigate("/restaurants"); }}>
            🍔 Burger
          </span>
          <span className="tag" onClick={() => { setSearchQuery("Biryani"); setContextSearchQuery("Biryani"); navigate("/restaurants"); }}>
            🍗 Biryani
          </span>
          <span className="tag" onClick={() => { setSearchQuery("Chinese"); setContextSearchQuery("Chinese"); navigate("/restaurants"); }}>
            🍜 Chinese
          </span>
          <span className="tag" onClick={() => { setSearchQuery("Desserts"); setContextSearchQuery("Desserts"); navigate("/restaurants"); }}>
            🍰 Desserts
          </span>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  );
};

export default Header;
