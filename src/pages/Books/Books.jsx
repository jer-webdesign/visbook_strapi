import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import "../../components/Modal/Modal.css";
import { useNavigate } from "react-router-dom";
import "./Books.css"; // optional styling
import { useAuth } from "../../context/AuthContext";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBook, setModalBook] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // const STRAPI_URL = "http://localhost:1337"; // Replace with live URL if needed
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
  const STRAPI_MEDIA_URL = import.meta.env.VITE_STRAPI_MEDIA_URL;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${STRAPI_URL}/api/books?populate=*&pagination[limit]=30`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Books API Response:", data);
        setBooks(data.data || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (bookID) => {
    navigate(`/books/${bookID}`);
  };

  const handleAddToCart = (book) => {
    let cartKey = "cart";
    if (currentUser && currentUser.uid) {
      cartKey = `cart_${currentUser.uid}`;
    }
    let existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const itemIndex = existingCart.findIndex(item => item.id === book.id);
    if (itemIndex === -1) {
      // Not in cart, add with quantity 1
      existingCart.push({ ...book, quantity: 1 });
    } else {
      // Already in cart, increment quantity
      existingCart[itemIndex].quantity = (existingCart[itemIndex].quantity || 1) + 1;
    }
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setModalBook(book);
    setModalOpen(true);
  };

  // If loading, show a spinner
  if (loading) {
    return (
      <main>
        <div className="spinner"></div>
      </main>
    );
  }  

  if (error) {
    return <main style={{ padding: "2rem" }}><p>Error loading books: {error}</p></main>;
  }

  return (
    <>
      <main style={{ padding: "2rem" }}>
        <h2>All Books</h2>
        <div className="books-container">
          {books.map((book) => {
            if (!book) return null;
            const cover = book.filename
              ? `${STRAPI_MEDIA_URL}/${book.filename}`
              : null;
            return (
              <div key={book.id} className="book-card">
                {cover ? (
                  <img
                    src={cover}
                    alt={book.title || "Book cover"}
                    onClick={() => handleBookClick(book.id)}
                    style={{
                      cursor: "pointer",
                      width: "200px",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      console.warn("Image failed to load:", cover);
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "200px",
                      height: "250px",
                      backgroundColor: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleBookClick(book.id)}
                  >
                    No Cover
                  </div>
                )}
                <h4>{book.title || "Unknown Title"}</h4>
                <p><em>{book.author || "Unknown Author"}</em></p>
                <p>${book.price_cad?.toFixed(2) || "0.00"} CAD</p>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(book)}>
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </main>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalBook ? (
          <div className="modal-cart-container">
            <div className="modal-cart-header">
              <div className="modal-cart-title">
                <span className="modal-cart-check">&#10003;</span>
                Item added to your cart
              </div>
              <span className="modal-cart-spacer"></span>
            </div>
            <div className="modal-cart-book-row">
              {modalBook.filename && (
                <img src={`${STRAPI_MEDIA_URL}/${modalBook.filename}`} alt={modalBook.title} className="modal-cart-img" />
              )}
              <div className="modal-cart-book-title">{modalBook.title}</div>
            </div>
            <hr className="modal-cart-hr" />
            <button
              className="modal-view-cart-btn"
              onClick={() => { setModalOpen(false); navigate('/cart'); }}
            >
              View cart
            </button>
            <button
              className="modal-continue-shopping-btn"
              onClick={() => { setModalOpen(false); navigate('/books'); }}
            >
              Continue shopping
            </button>
          </div>
        ) : null}
      </Modal>
    </>
  );
}