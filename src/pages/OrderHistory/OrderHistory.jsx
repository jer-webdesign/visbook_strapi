import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../firebase";
import "./OrderHistory.css";

export default function OrderHistory() {
  const { currentUser, userProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    if (!currentUser) return;
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, [currentUser, db]);

  return (
    <div className="order-history-container">
      <nav className="breadcrumb-nav">
        <a href="/visbook_strapi/dashboard" className="breadcrumb-link">Your Account</a>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">Your Orders</span>
      </nav>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p className="order-history-empty">No orders found.</p>
      ) : (
        <ul className="order-list">
          {orders.map(order => {
            // Format date
            let dateStr = '';
            if (order.createdAt && order.createdAt.seconds) {
              const d = new Date(order.createdAt.seconds * 1000);
              dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
            }
            // Ship to name
            // Use user's full name from profile or email for Ship To
            let shipTo = '';
            if (userProfile?.displayName) {
              shipTo = userProfile.displayName;
            } else if (currentUser?.email) {
              shipTo = currentUser.email.split('@')[0];
            }
            // Only render orders that have an order number (valid orders)
            if (!order.orderNumber) return null;
            return (
              <li key={order.id} className="order-item">
                <div className="order-details">
                  <div className="order-summary-row">
                    <div className="order-summary-col">
                      <div className="order-label">Order placed</div>
                      <div>{dateStr || 'N/A'}</div>
                    </div>
                    <div className="order-summary-col">
                      <div className="order-label">Total</div>
                      <div>${order.total}</div>
                    </div>
                    <div className="order-summary-col">
                      <div className="order-label">Ship to</div>
                      <div>{shipTo || 'N/A'}</div>
                    </div>
                    <div className="order-summary-col">
                      <div className="order-label">Order #</div>
                      <div>{order.orderNumber}</div>
                    </div>
                    <div className="order-summary-col">
                      <div className="order-label">Payment Method</div>
                      <div>{order.paymentMethod || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="order-books-vertical">
                    {order.items && order.items.length ? order.items.map((item, idx) => {
                      const STRAPI_MEDIA_URL = import.meta.env.VITE_STRAPI_MEDIA_URL;
                      const cover = item.filename
                        ? `${STRAPI_MEDIA_URL}/${item.filename}`
                        : null;
                      return (
                        <div key={idx} className="order-book-entry-vertical">
                          {cover ? (
                            <img src={cover} alt={item.title} className="order-book-cover-vertical" />
                          ) : (
                            <div className="order-book-nocover-vertical">No Cover</div>
                          )}
                          <div>
                            <div className="order-book-title-vertical">{item.title}</div>
                            <div className="order-book-author-vertical">{item.author}</div>
                          </div>
                        </div>
                      );
                    }) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
