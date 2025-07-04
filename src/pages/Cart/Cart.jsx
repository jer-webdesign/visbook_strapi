// src/pages/Cart/Cart.jsx
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useAuth } from "../../context/AuthContext";
// import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
// import { app } from "../../firebase";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  // const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { currentUser } = useAuth();
  // const db = getFirestore(app);
  const navigate = useNavigate();

  // Strapi API URL - same as in Books.jsx
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
  const STRAPI_MEDIA_URL = import.meta.env.VITE_STRAPI_MEDIA_URL;


  // Load cart on user change and when cartUpdated event fires
  useEffect(() => {
    const loadCart = () => {
      let cartKey = "cart";
      if (currentUser && currentUser.uid) {
        cartKey = `cart_${currentUser.uid}`;
      }
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
    };
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => {
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, [currentUser]);


  // Handle quantity change
  const handleQuantityChange = (index, delta) => {
    setCartItems(prevItems => {
      const updated = prevItems.map((item, i) => {
        if (i === index) {
          const newQty = (item.quantity || 1) + delta;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      });
      if (currentUser) {
        const cartKey = `cart_${currentUser.uid}`;
        localStorage.setItem(cartKey, JSON.stringify(updated));
      }
      window.dispatchEvent(new Event('cartUpdated'));
      return updated;
    });
  };

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    let cartKey = "cart";
    if (currentUser && currentUser.uid) {
      cartKey = `cart_${currentUser.uid}`;
    }
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + (item.price_cad * (item.quantity || 1)), 0);

  // Handle checkout
  const handleCheckout = () => {
    if (!currentUser) {
      setModalOpen(true);
      return;
    }
    if (cartItems.length === 0) return;
    // Navigate to payment page (simulate payment page route)
    navigate('/payment', { state: { cartItems, total } });
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="cart-empty-message">
          <p>Your cart is empty.</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/books')}>
            Continue shopping
          </button>
        </div>
      ) : (
        <div>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-details">
                  <img
                    src={
                      item.filename
                        ? `${STRAPI_MEDIA_URL}/${item.filename}`
                        : `${STRAPI_URL}${item.image || ""}`
                    }
                    alt={item.title}
                  />
                  <div>
                    <h2>{item.title}</h2>
                    <p>Author: {item.author}</p>
                    <p>Price: ${item.price_cad.toFixed(2)} CAD</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                    </div>
                  </div>
                </div>
                <button className="remove-button" onClick={() => removeFromCart(index)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <p>Total: ${total.toFixed(2)} CAD</p>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a3a4a', fontWeight: 600, fontSize: '1.08rem' }}>
              <span style={{ color: '#e67c17', fontSize: 22, fontWeight: 700, marginRight: 4 }}>&#9888;</span>
              You must be signed in to checkout
            </div>
            <span style={{ width: 32 }}></span>
          </div>
          <hr style={{ width: '100%', border: 0, borderTop: '1px solid #e0e7ef', margin: '1.1rem 0 0.7rem 0' }} />
          {/* View cart button removed as requested */}
          <button
            className="modal-continue-shopping-btn"
            onClick={() => { setModalOpen(false); navigate('/books'); }}
          >
            Continue shopping
          </button>
        </div>
      </Modal>
    </div>
  );
}
