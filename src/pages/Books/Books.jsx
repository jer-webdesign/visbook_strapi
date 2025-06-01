// src/pages/Books/Books.jsx
import { useNavigate } from "react-router-dom";
import books from "../../data/visbook.json";
import "./Books.css"; // optional styling

export default function Books() {
  const navigate = useNavigate();

  const handleBookClick = (bookID) => {
    navigate(`/books/${bookID}`);
  };

  const handleAddToCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isAlreadyInCart = existingCart.some(item => item.bookID === book.bookID);
    if (!isAlreadyInCart) {
      localStorage.setItem("cart", JSON.stringify([...existingCart, book]));
      alert(`Added "${book.title}" to cart!`);
    } else {
      alert(`"${book.title}" is already in your cart.`);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h2>All Books</h2>
      <div className="books-container">
        {books.map((book) => {
          const cover = new URL(`../../assets/images/book-covers/${book.filename}`, import.meta.url).href;
          return (
            <div key={book.bookID} className="book-card">
              <img
                src={cover}
                alt={book.title}
                onClick={() => handleBookClick(book.bookID)}
                style={{ cursor: "pointer", width: "200px" }}
              />
              <h4>{book.title}</h4>
              <p><em>{book.author}</em></p>
              <p>${book.price_cad.toFixed(2)} CAD</p>
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(book)}>Add to Cart</button>        
            </div>
          );
        })}
      </div>
    </main>
  );
}
