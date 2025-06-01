import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import books from "../../data/visbook.json";
import "./NewBooks.css";

export default function NewBooks() {
  const newBooksRef = useRef(null);
  const bestSellersRef = useRef(null);
  const navigate = useNavigate();

  const scrollByAmount = 236;

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
    }
  };

  const handleBookClick = (bookID) => {
    navigate(`/books/${bookID}`);
  };

  const handleAddToCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isAlreadyInCart = existingCart.some((item) => item.bookID === book.bookID);
    if (!isAlreadyInCart) {
      const updatedCart = [...existingCart, book];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      alert(`Added "${book.title}" to cart!`);
    } else {
      alert(`"${book.title}" is already in your cart.`);
    }
  };

  const newReleases = books.filter((book) => book.isNewRelease);
  const bestSellers = books.filter((book) => book.isBestSeller);

  const renderBookCarousel = (bookList, ref, showArrows = true) => (
    <section className="book-list">
      {showArrows && (
        <button className="scroll-arrow left-arrow" onClick={() => scrollLeft(ref)} aria-label="Scroll left">
          &#9664;
        </button>
      )}

      <section className="book-carousel" ref={ref}>
        {bookList.map((book) => {
          const cover = new URL(`../../assets/images/book-covers/${book.filename}`, import.meta.url).href;

          return (
            <article key={book.bookID} className="book">
              <figure onClick={() => handleBookClick(book.bookID)} style={{ cursor: "pointer" }}>
                <img src={cover} alt={`Cover of ${book.title}`} width={200} height="auto" />
                <figcaption>
                  <h4>{book.title}</h4>
                  <p><em>{book.author}</em></p>
                  <p>${book.price_cad.toFixed(2)} CAD</p>
                </figcaption>
              </figure>
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(book)}>Add to Cart</button>
            </article>
          );
        })}
      </section>

      {showArrows && (
        <button className="scroll-arrow right-arrow" onClick={() => scrollRight(ref)} aria-label="Scroll right">
          &#9654;
        </button>
      )}
    </section>
  );

  return (
    <main>
      <h2>New Releases</h2>
      {renderBookCarousel(newReleases, newBooksRef, true)}

      <h2>Best Sellers</h2>
      {renderBookCarousel(bestSellers, bestSellersRef, true)}     
    </main>
  );
}
