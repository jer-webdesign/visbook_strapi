//src/components/BookDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import books from "../../data/visbook.json";
import "./BookDetail.css"; // Optional styling

export default function BookDetail() {
  const { bookID } = useParams();
  const book = books.find((b) => String(b.bookID) === bookID);

  if (!book) return <p>Book not found</p>;

  const cover = new URL(`../../assets/images/book-covers/${book.filename}`, import.meta.url).href;

  return (
    <div className="book-detail-container">
      <div className="book-detail">
        <img src={cover} alt={`Cover of ${book.title}`} className="book-cover" />
        <div className="book-info">
          <h3>{book.title}</h3>
          {book.subtitle && <h5>{book.subtitle}</h5>}
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Description:</strong> {book.description}</p>
          <p><strong>Published Year:</strong> {book.published_year}</p>
          <p><strong>Pages:</strong> {book.number_of_pages}</p>
          <p><strong>ISBN-13:</strong> {book.ISBN_13}</p>
          <p><strong>ISBN-10:</strong> {book.ISBN_10}</p>
          <p><strong>Price:</strong> ${book.price_cad.toFixed(2)} CAD</p>
        </div>
      </div>
    </div>
  );
}

