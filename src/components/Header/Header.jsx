import React, { useState } from "react";
import "./Header.scss";
import Logo from "../../assets/images/Zomato-Logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import blackLogo from "../../assets/images/blackLogo.webp";
import SearchIcon from "@mui/icons-material/Search";
import { CSSTransition } from "react-transition-group";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="header">
      <div className="header-overlay"></div>
      <nav className="header-nav">
        <span className="nav-link get-app">Get the App</span>
        <div className="right">
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
            <span className="menu-item">Investor Relations</span>
            <span className="menu-item">Add restaurants</span>
            <span className="menu-item">Log In</span>
            <span className="menu-item">Sign Up</span>
          </div>
        </div>
      </CSSTransition>
      <div className="headerContent">
        <img src={Logo} alt="logo" className="hero-logo animate-float" />
        <h3 className="hero-title animate-fade-in-up">Discover the best food & drinks in Patna</h3>
        <div className={`input-container ${searchFocused ? 'focused' : ''}`}>
          <div className="location-select">
            <span className="location-icon">📍</span>
            <select name="" id="">
              <option value="Chennai">Chennai</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>
          <div className="divider"></div>
          <div className="search-input">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search for restaurant, cuisine or a dish"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        <div className="quick-tags">
          <span className="tag">🍕 Pizza</span>
          <span className="tag">🍔 Burger</span>
          <span className="tag">🍣 Sushi</span>
          <span className="tag">☕ Coffee</span>
          <span className="tag">🍜 Noodles</span>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  );
};

export default Header;
