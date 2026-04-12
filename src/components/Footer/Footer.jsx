import React from "react";
import "./Footer.scss";
import App from "../../assets/images/App-Store.png";
import Phone from "../../assets/images/Google-Play.png";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="footer">
      <div className="footer-main">
        <div className="footer-top">
          <div className="top-left">
            <h2 className="logo-text">
              <RestaurantIcon className="logo-icon" />
              Zomato
            </h2>
            <div className="lang">
              <select className="select-wrapper">
                <option value="India">🇮🇳 India</option>
                <option value="Australia">🇦🇺 Australia</option>
                <option value="London">🇬🇧 London</option>
                <option value="America">🇺🇸 America</option>
                <option value="France">🇫🇷 France</option>
                <option value="Brazil">🇧🇷 Brazil</option>
                <option value="England">🇬🇧 England</option>
                <option value="South Africa">🇿🇦 South Africa</option>
                <option value="Rusia">🇷🇺 Rusia</option>
              </select>
              <select className="select-wrapper">
                <option value="English">🌐 English</option>
                <option value="Hindi">🌐 Hindi</option>
                <option value="Polish">🌐 Polish</option>
              </select>
            </div>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>ABOUT ZOMATO</h4>
            <a href="#">who we are</a>
            <a href="#">blog</a>
            <a href="#">work with us</a>
            <a href="#">Investor Relations</a>
            <a href="#">Report Fraud</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-column">
            <h4>ZOMAVERSE</h4>
            <a href="#">Zomato</a>
            <a href="#">Blinkit</a>
            <a href="#">Feeding India</a>
            <a href="#">HyperPure</a>
            <a href="#">Zomaland</a>
          </div>
          <div className="footer-column">
            <h4>FOR RESTAURANTS</h4>
            <a href="#">Partner with Us</a>
            <a href="#">Apps For you</a>
            <h4 className="mt-20">For Enterprises</h4>
            <a href="#">Zomato for work</a>
          </div>
          <div className="footer-column">
            <h4>LEARN MORE</h4>
            <a href="#">Privacy</a>
            <a href="#">Security</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </div>
          <div className="footer-column social-column">
            <h4>SOCIAL LINKS</h4>
            <div className="social-icons">
              <a href="#" className="social-icon"><LinkedInIcon /></a>
              <a href="#" className="social-icon"><InstagramIcon /></a>
              <a href="#" className="social-icon"><TwitterIcon /></a>
              <a href="#" className="social-icon"><YouTubeIcon /></a>
              <a href="#" className="social-icon"><FacebookIcon /></a>
            </div>
            <img src={App} alt="app" className="store-img" />
            <img src={Phone} alt="app" className="store-img" />
          </div>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <p>
          By continuing past this page, you agree to our Terms of Service,
          Cookie Policy, Privacy Policy and Content Policies. All trademarks are
          properties of their respective owners. 2008-2022 © Zomato™ Ltd. All
          rights reserved.
        </p>
      </div>
      <button className="scroll-top-btn" onClick={scrollToTop}>
        <ExpandLessIcon />
      </button>
    </div>
  );
};

export default Footer;
