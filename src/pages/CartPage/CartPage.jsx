import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useApp } from "../../context/AppContext";
import "./CartPage.scss";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        restaurantName: item.restaurantName,
        items: [],
        total: 0,
      };
    }
    acc[item.restaurantId].items.push(item);
    acc[item.restaurantId].total += item.price * item.quantity;
    return acc;
  }, {});

  const deliveryFee = 40;
  const platformFee = 20;
  const totalAmount = getCartTotal() + deliveryFee + platformFee;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <div className="empty-cart">
          <ShoppingCartIcon className="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Add items from restaurants to get started</p>
          <button className="btn-zomato" onClick={() => navigate("/restaurants")}>
            Browse Restaurants
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />

      <div className="cart-container">
        <div className="cart-main">
          <h1>Your Cart</h1>
          <span className="item-count">{getCartItemCount()} items</span>

          {Object.entries(groupedCart).map(([restaurantId, { restaurantName, items, total }]) => (
            <div key={restaurantId} className="restaurant-section">
              <Link to={`/restaurant/${restaurantId}`} className="restaurant-name">
                {restaurantName}
              </Link>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={`${item.id}-${item.restaurantId}`} className="cart-item">
                    <div className="item-info">
                      <div className="item-header">
                        <span className={`veg-indicator ${item.isVeg ? "veg" : "non-veg"}`}>
                          <span className="dot"></span>
                        </span>
                        <span className="item-name">{item.name}</span>
                      </div>
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity({ id: item.id, restaurantId: item.restaurantId }, item.quantity - 1)
                          }
                        >
                          <RemoveIcon />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity({ id: item.id, restaurantId: item.restaurantId }, item.quantity + 1)
                          }
                        >
                          <AddIcon />
                        </button>
                      </div>
                    </div>
                    <div className="item-pricing">
                      <span className="item-total">₹{item.price * item.quantity}</span>
                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeFromCart({ id: item.id, restaurantId: item.restaurantId })
                        }
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="restaurant-subtotal">
                Subtotal: ₹{total}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
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
          <button className="btn-zomato checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
            <ArrowForwardIcon />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
