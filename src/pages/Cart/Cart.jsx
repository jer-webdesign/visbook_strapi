// src/pages/Cart/Cart.jsx
import React, { useEffect, useState } from "react";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <h3>There are currently no items in your shopping cart.</h3>
      ) : (
        <ul className="cart-items">
          {cartItems.map((item, index) => {
            const cover = new URL(`../../assets/images/book-covers/${item.filename}`, import.meta.url).href;
            return (
              <li key={index} className="cart-item">
                <img src={cover} alt={`Cover of ${item.title}`} width="120" height="auto" />
                <div>
                  <div className="cart-item-title"><strong>{item.title}</strong></div>
                  <div className="cart-item-author">{item.author}</div>
                  <div>${item.price_cad.toFixed(2)} CAD</div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(index)}>Remove</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
