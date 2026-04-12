import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./MenuItem.scss";

const MenuItem = ({ item, quantity, onQuantityChange, onAdd }) => {
  return (
    <div className="menu-item">
      <div className="item-details">
        <div className="item-header">
          <span className={`veg-indicator ${item.isVeg ? "veg" : "non-veg"}`}>
            <span className="dot"></span>
          </span>
          <h3 className="item-name">{item.name}</h3>
        </div>
        <p className="item-description">{item.description}</p>
        <p className="item-price">₹{item.price}</p>
      </div>
      <div className="item-actions">
        {quantity > 0 ? (
          <div className="quantity-control">
            <button
              className="qty-btn"
              onClick={() => onQuantityChange(item.id, -1)}
            >
              <RemoveIcon />
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => onQuantityChange(item.id, 1)}
            >
              <AddIcon />
            </button>
          </div>
        ) : null}
        <button
          className="add-btn"
          onClick={() => {
            if (quantity === 0) {
              onQuantityChange(item.id, 1);
            } else {
              onAdd(item);
            }
          }}
        >
          {quantity > 0 ? (
            <>
              <AddIcon /> Add
            </>
          ) : (
            <>Add</>
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
