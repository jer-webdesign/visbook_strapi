// src/components/BookDetail.jsx
// src/components/BookDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BookDetail.css";

export default function BookDetail() {
  const { bookID } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch("https://loved-rhythm-7c69d3a485.strapiapp.com/api/books?populate=*");
        // const res = await fetch("http://localhost:1337/api/books?populate=*");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        // Find the correct book by ID
        const foundBook = data.data.find((b) => String(b.id) === bookID);
        if (foundBook) {
          setBook(foundBook);
        } else {
          setError("Book not found");
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(err.message);
      }
    };

    fetchBook();
  }, [bookID]);

  if (error) return <p>Error: {error}</p>;
  if (!book) return <p>Loading...</p>;

  // Handle image from Strapi media library
  // const cover = book.media_url?.url
  //   ? `http://localhost:1337${book.media_url.url}`
  //   : null;
  // const cover = book.media_url?.url
  //   ? `https://loved-rhythm-7c69d3a485.strapiapp.com/uploads/${book.media_url.url}`
  //   : null;  
  const cover = book.filename
    ? `https://loved-rhythm-7c69d3a485.media.strapiapp.com/${book.filename}`
    : null;       

  return (
    <div className="book-detail-container">
      <div className="book-detail">
        {cover && (
          <img
            src={cover}
            alt={`Cover of ${book.title}`}
            className="book-cover"
          />
        )}
        <div className="book-info">
          <h3>{book.title}</h3>
          {book.subtitle && <h5>{book.subtitle}</h5>}
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Description:</strong> {book.description}</p>
          <p><strong>Published Date:</strong> {book.published_date}</p>
          <p><strong>Pages:</strong> {book.number_of_pages}</p>
          <p><strong>ISBN-13:</strong> {book.ISBN_13}</p>
          <p><strong>ISBN-10:</strong> {book.ISBN_10}</p>
          <p><strong>Price:</strong> ${book.price_cad?.toFixed(2)} CAD</p>
          <p><strong>Rating:</strong> {book.average_rating} ({book.rating_count} reviews)</p>
          {book.isNewRelease && <span className="badge new-release">New Release</span>}
          {book.isBestSeller && <span className="badge best-seller">Best Seller</span>}
        </div>
      </div>
    </div>
  );
}



//src/components/BookDetail.jsx
// import React from "react";
// import { useParams } from "react-router-dom";
// import books from "../../data/visbook.json";
// import "./BookDetail.css"; // Optional styling

// export default function BookDetail() {
//   const { bookID } = useParams();
//   const book = books.find((b) => String(b.bookID) === bookID);

//   if (!book) return <p>Book not found</p>;

//   const cover = `${import.meta.env.BASE_URL}assets/images/book-covers/${book.filename}`;

//   return (
//     <div className="book-detail-container">
//       <div className="book-detail">
//         <img src={cover} alt={`Cover of ${book.title}`} className="book-cover" />
//         <div className="book-info">
//           <h3>{book.title}</h3>
//           {book.subtitle && <h5>{book.subtitle}</h5>}
//           <p><strong>Author:</strong> {book.author}</p>
//           <p><strong>Description:</strong> {book.description}</p>
//           <p><strong>Published Year:</strong> {book.published_year}</p>
//           <p><strong>Pages:</strong> {book.number_of_pages}</p>
//           <p><strong>ISBN-13:</strong> {book.ISBN_13}</p>
//           <p><strong>ISBN-10:</strong> {book.ISBN_10}</p>
//           <p><strong>Price:</strong> ${book.price_cad.toFixed(2)} CAD</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import "./BookDetail.css";

// export default function BookList() {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         // const res = await fetch("http://loved-rhythm-7c69d3a485.strapiapp.com/api/books?populate=*");
//         const res = await fetch("http://localhost:1337/api/books?populate=*");
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         const data = await res.json();
//         console.log("BookList API Response:", data); // Debug log
//         setBooks(data.data || []);
//       } catch (err) {
//         console.error("Error fetching books from Strapi:", err);
//         setError(err.message);
//         setBooks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   if (loading) {
//     return <div className="book-detail-container"><p>Loading books...</p></div>;
//   }

//   if (error) {
//     return <div className="book-detail-container"><p>Error loading books: {error}</p></div>;
//   }

//   return (
//     <div className="book-detail-container">
//       <div className="book-detail">
//         {books.map((book) => {
//           // Safety check for book data
//           if (!book) {
//             console.warn("Invalid book data:", book);
//             return null;
//           }

//           // Book data is at root level, not under attributes
//           const b = book;
          
//           // Use filename for local images based on your data structure
//           // const cover = b.filename 
//           // ? `http://loved-rhythm-7c69d3a485.strapiapp.com/assets/images/book-covers/${b.filename}`
//           // : null;
//           // ? `${import.meta.env.BASE_URL}assets/images/book-covers/${b.filename}`
//           // : null;

//           const cover = book.media_url?.url
//             ? `http://localhost:1337${book.media_url.url}`
//             : null;             

//           return (
//             <div key={book.id} className="book-card">
//               {cover && (
//                 <img
//                   src={cover}
//                   alt={`Cover of ${b.title || 'Unknown Title'}`}
//                   className="book-cover"
//                 />
//               )}
//               <div className="book-info">
//                 <h3>{b.title || 'Unknown Title'}</h3>
//                 {b.subtitle && <h5>{b.subtitle}</h5>}
//                 <p><strong>Author:</strong> {b.author || 'Unknown Author'}</p>
//                 <p><strong>Description:</strong> {b.description || 'No description available'}</p>
//                 <p><strong>Published Date:</strong> {b.published_date || 'Unknown'}</p>
//                 <p><strong>Pages:</strong> {b.number_of_pages || 'Unknown'}</p>
//                 <p><strong>ISBN-13:</strong> {b.ISBN_13 || 'N/A'}</p>
//                 <p><strong>ISBN-10:</strong> {b.ISBN_10 || 'N/A'}</p>
//                 <p><strong>Price:</strong> ${b.price_cad?.toFixed(2) || '0.00'} CAD</p>
//                 <p><strong>Rating:</strong> {b.average_rating || 'No rating'} ({b.rating_count || 0} reviews)</p>
//                 {b.isNewRelease && <span className="badge new-release">New Release</span>}
//                 {b.isBestSeller && <span className="badge best-seller">Best Seller</span>}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
