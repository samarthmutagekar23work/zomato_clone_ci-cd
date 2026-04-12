import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useApp } from "../../context/AppContext";
import "./CheckoutPage.scss";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useApp();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "Belgaum",
    state: "Karnataka",
    pincode: "",
  });
  const [selectedPayment, setSelectedPayment] = useState("card");

  const deliveryFee = 40;
  const platformFee = 20;
  const totalAmount = getCartTotal() + deliveryFee + platformFee;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cart.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cart, orderPlaced, navigate]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const isAddressValid = () => {
    return (
      address.name.trim() !== "" &&
      address.phone.trim() !== "" &&
      address.street.trim() !== "" &&
      address.pincode.trim() !== "" &&
      address.pincode.length === 6
    );
  };

  const handlePlaceOrder = () => {
    const newOrderId = `ORD${Date.now().toString().slice(-8)}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    clearCart();
  };

  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        restaurantName: item.restaurantName,
        items: [],
      };
    }
    acc[item.restaurantId].items.push(item);
    return acc;
  }, {});

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="order-success">
          <div className="success-icon">
            <CheckCircleIcon />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p className="order-id">Order ID: {orderId}</p>
          <p className="success-message">
            Thank you for your order. Your food is being prepared and will be delivered soon.
          </p>
          <div className="delivery-info">
            <h3>Delivery Address</h3>
            <p>{address.name}</p>
            <p>{address.street}</p>
            <p>{address.city}, {address.state} - {address.pincode}</p>
            <p>Phone: {address.phone}</p>
          </div>
          <button className="btn-zomato" onClick={() => navigate("/home")}>
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header />

      <div className="checkout-container">
        <div className="checkout-main">
          <div className="steps">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <span className="step-number">1</span>
              <span className="step-label">Delivery</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <span className="step-number">2</span>
              <span className="step-label">Payment</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>
              <span className="step-number">3</span>
              <span className="step-label">Review</span>
            </div>
          </div>

          {step === 1 && (
            <div className="address-section">
              <h2>Delivery Address</h2>
              <div className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={address.name}
                      onChange={handleAddressChange}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="Enter street address"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={address.city} readOnly />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={address.state} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      placeholder="6 digit pincode"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
              <button
                className="btn-zomato"
                onClick={() => isAddressValid() && setStep(2)}
                disabled={!isAddressValid()}
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="payment-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <div
                  className={`payment-option ${selectedPayment === "card" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("card")}
                >
                  <CreditCardIcon />
                  <div className="option-info">
                    <span className="option-title">Credit/Debit Card</span>
                    <span className="option-desc">Pay with Visa, Mastercard, etc.</span>
                  </div>
                  <div className="radio-circle"></div>
                </div>
                <div
                  className={`payment-option ${selectedPayment === "upi" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("upi")}
                >
                  <PaymentsIcon />
                  <div className="option-info">
                    <span className="option-title">UPI</span>
                    <span className="option-desc">Pay with Google Pay, PhonePe, etc.</span>
                  </div>
                  <div className="radio-circle"></div>
                </div>
                <div
                  className={`payment-option ${selectedPayment === "wallet" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("wallet")}
                >
                  <AccountBalanceWalletIcon />
                  <div className="option-info">
                    <span className="option-title">Wallet</span>
                    <span className="option-desc">Paytm, Mobikwik, etc.</span>
                  </div>
                  <div className="radio-circle"></div>
                </div>
                <div
                  className={`payment-option ${selectedPayment === "cod" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("cod")}
                >
                  <LocationOnIcon />
                  <div className="option-info">
                    <span className="option-title">Cash on Delivery</span>
                    <span className="option-desc">Pay when you receive</span>
                  </div>
                  <div className="radio-circle"></div>
                </div>
              </div>
              <div className="button-row">
                <button className="back-btn" onClick={() => setStep(1)}>
                  Back
                </button>
                <button className="btn-zomato" onClick={() => setStep(3)}>
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="review-section">
              <h2>Review Your Order</h2>
              
              <div className="review-block">
                <h3>Delivery Address</h3>
                <p><strong>{address.name}</strong></p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p>Phone: {address.phone}</p>
              </div>

              <div className="review-block">
                <h3>Order Details</h3>
                {Object.entries(groupedCart).map(([restaurantId, { restaurantName, items }]) => (
                  <div key={restaurantId} className="restaurant-order">
                    <h4>{restaurantName}</h4>
                    {items.map((item) => (
                      <div key={`${item.id}-${item.restaurantId}`} className="order-item">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="review-block">
                <h3>Payment Method</h3>
                <p>
                  {selectedPayment === "card" && "Credit/Debit Card"}
                  {selectedPayment === "upi" && "UPI"}
                  {selectedPayment === "wallet" && "Wallet"}
                  {selectedPayment === "cod" && "Cash on Delivery"}
                </p>
              </div>

              <div className="button-row">
                <button className="back-btn" onClick={() => setStep(2)}>
                  Back
                </button>
                <button className="btn-zomato" onClick={handlePlaceOrder}>
                  Place Order - ₹{totalAmount}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={`${item.id}-${item.restaurantId}`} className="summary-item">
                <span>{item.quantity}x {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{getCartTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
