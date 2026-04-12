import React, { useState } from "react";
import "./CTA.scss";
import Google from "../../assets/images/Google-Play.png";
import App from "../../assets/images/App-Store.png";
import Phone from "../../assets/images/Iphone.png";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import SendIcon from "@mui/icons-material/Send";

const CTA = () => {
  const [email, setEmail] = useState(true);
  const [phone, setPhone] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setInputValue("");
      }, 3000);
    }
  };

  return (
    <div className="cta">
      <div className="cta-bg-pattern"></div>
      <div className="cta-container">
        <div className="left">
          <div className="phone-wrapper">
            <img src={Phone} alt="phone" className="phone-image" />
            <div className="phone-shine"></div>
          </div>
        </div>
        <div className="right">
          <div className="content">
            <span className="badge">📱 Free Download</span>
            <h1>Get the Zomato app</h1>
            <p>We will send you a link, open it on your phone to download the app</p>
            
            <div className="radio">
              <div className={`radioBtn ${email ? 'active' : ''}`} onClick={() => { setEmail(true); setPhone(false); }}>
                <input
                  type="radio"
                  value="email"
                  id="email"
                  name="radio"
                  checked={email}
                  onChange={() => {}}
                />
                <label htmlFor="email">
                  <MailOutlineIcon className="radio-icon" /> Email
                </label>
              </div>
              <div className={`radioBtn ${phone ? 'active' : ''}`} onClick={() => { setPhone(true); setEmail(false); }}>
                <input
                  type="radio"
                  value="phone"
                  id="phone"
                  name="radio"
                  checked={phone}
                  onChange={() => {}}
                />
                <label htmlFor="phone">
                  <PhoneAndroidIcon className="radio-icon" /> Phone
                </label>
              </div>
            </div>

            <form className="input-form" onSubmit={handleSubmit}>
              {email && (
                <div className="input-wrapper">
                  <MailOutlineIcon className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              )}
              {phone && (
                <div className="input-wrapper">
                  <PhoneAndroidIcon className="input-icon" />
                  <input 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              )}
              <button type="submit" className={`submit-btn ${isSubmitted ? 'success' : ''}`}>
                {isSubmitted ? '✓ Sent!' : (
                  <>
                    Share App Link <SendIcon className="send-icon" />
                  </>
                )}
              </button>
            </form>

            <span className="download-text">Download app from</span>
            <div className="img">
              <img src={Google} alt="google" className="store-img" />
              <img src={App} alt="app" className="store-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
