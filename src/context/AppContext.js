import React, { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();

const initialState = {
  city: localStorage.getItem("selectedCity") || "",
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  searchQuery: "",
  searchResults: [],
  filters: {
    rating: 0,
    priceRange: [0, 1000],
    cuisine: "",
    sortBy: "rating",
  },
  isAuthenticated: false,
  user: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_CITY":
      localStorage.setItem("selectedCity", action.payload);
      return { ...state, city: action.payload };

    case "ADD_TO_CART": {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id && item.restaurantId === action.payload.restaurantId
      );
      let newCart;
      if (existingItem) {
        newCart = state.cart.map((item) =>
          item.id === action.payload.id && item.restaurantId === action.payload.restaurantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "REMOVE_FROM_CART": {
      const newCart = state.cart.filter(
        (item) => !(item.id === action.payload.id && item.restaurantId === action.payload.restaurantId)
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "UPDATE_QUANTITY": {
      const newCart = state.cart
        .map((item) =>
          item.id === action.payload.id && item.restaurantId === action.payload.restaurantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "CLEAR_CART":
      localStorage.setItem("cart", JSON.stringify([]));
      return { ...state, cart: [] };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: {
          rating: 0,
          priceRange: [0, 1000],
          cuisine: "",
          sortBy: "rating",
        },
      };

    case "LOGIN":
      return { ...state, isAuthenticated: true, user: action.payload };

    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToCart = (item, restaurantId, restaurantName) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, restaurantId, restaurantName },
    });
  };

  const removeFromCart = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  const updateQuantity = (item, quantity) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { ...item, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const setCity = (city) => {
    dispatch({ type: "SET_CITY", payload: city });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  };

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        setCity,
        setSearchQuery,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export default AppContext;
