import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Books.css"; // optional styling

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const STRAPI_URL = "http://localhost:1337"; // Replace with live URL if needed
  const STRAPI_URL = "https://loved-rhythm-7c69d3a485.strapiapp.com";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${STRAPI_URL}/api/books?populate=*`);
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
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isAlreadyInCart = existingCart.some(item => item.id === book.id);
    if (!isAlreadyInCart) {
      localStorage.setItem("cart", JSON.stringify([...existingCart, book]));
      alert(`Added "${book.title}" to cart!`);
    } else {
      alert(`"${book.title}" is already in your cart.`);
    }
  };

  // Helper to get image URL from media_url
  const getImageUrl = (media_url) => {
    if (!media_url || !media_url.url) return null;
    return media_url.url.startsWith("http")
      ? media_url.url
      : `${STRAPI_URL}${media_url.url}`;
  };

  if (loading) {
    return <main style={{ padding: "2rem" }}><p>Loading books...</p></main>;
  }

  if (error) {
    return <main style={{ padding: "2rem" }}><p>Error loading books: {error}</p></main>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h2>All Books</h2>
      <div className="books-container">
        {books.map((book) => {
          if (!book) return null;

          // Since book data is flat, not under attributes
          // const cover = getImageUrl(book.media_url);
          const cover = book.filename
            ? `https://loved-rhythm-7c69d3a485.media.strapiapp.com/${book.filename}`
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
  );
}

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Books.css"; // optional styling

// export default function Books() {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const STRAPI_URL = "http://localhost:1337"; // or your deployed URL

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${STRAPI_URL}/api/books?populate=*`);
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();
//         console.log("Books API Response:", data);
//         setBooks(data.data || []);
//       } catch (err) {
//         console.error("Error fetching books:", err);
//         setError(err.message);
//         setBooks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const getImageUrl = (media) => {
//     if (!media) return null;

//     // If media is a direct media object (like 'media_url' in your data)
//     if (media.url) {
//       return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
//     }

//     // Optional: If media is nested in .data.attributes.url
//     if (media.data?.attributes?.url) {
//       const url = media.data.attributes.url;
//       return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
//     }

//     return null;
//   };

//   const handleBookClick = (bookID) => {
//     navigate(`/books/${bookID}`);
//   };

//   const handleAddToCart = (book) => {
//     const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
//     const isAlreadyInCart = existingCart.some((item) => item.id === book.id);
//     if (!isAlreadyInCart) {
//       localStorage.setItem("cart", JSON.stringify([...existingCart, book]));
//       alert(`Added "${book.attributes?.title || book.title}" to cart!`);
//     } else {
//       alert(`"${book.attributes?.title || book.title}" is already in your cart.`);
//     }
//   };

//   if (loading) {
//     return (
//       <main style={{ padding: "2rem" }}>
//         <p>Loading books...</p>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main style={{ padding: "2rem" }}>
//         <p>Error loading books: {error}</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: "2rem" }}>
//       <h2>All Books</h2>
//       <div className="books-container">
//         {books.map((book) => {
//           if (!book) return null;

//           const bookData = book.attributes || book;

//           // Try retrieving from media_url (custom media object), fallback to filename
//           const coverImageUrl = getImageUrl(bookData.media_url);
//           const fallbackCover = bookData.filename
//             ? `${STRAPI_URL}/uploads/${bookData.filename}`
//             : null;
//           const finalCoverUrl = coverImageUrl || fallbackCover;

//           return (
//             <div key={book.id} className="book-card">
//               {finalCoverUrl ? (
//                 <img
//                   src={finalCoverUrl}
//                   alt={bookData.title || "Book cover"}
//                   onError={(e) => {
//                     console.error(`Failed to load image: ${finalCoverUrl}`);
//                     e.target.style.display = "none";
//                   }}
//                   onClick={() => handleBookClick(book.id)}
//                   style={{
//                     cursor: "pointer",
//                     width: "200px",
//                     height: "250px",
//                     objectFit: "cover",
//                     borderRadius: "8px",
//                   }}
//                 />
//               ) : (
//                 <div
//                   style={{
//                     width: "200px",
//                     height: "250px",
//                     backgroundColor: "#f0f0f0",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     borderRadius: "8px",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => handleBookClick(book.id)}
//                 >
//                   <span>No Cover Image</span>
//                 </div>
//               )}

//               <h4>{bookData.title || "Unknown Title"}</h4>
//               <p>
//                 <em>{bookData.author || "Unknown Author"}</em>
//               </p>
//               <p>${(bookData.price_cad || bookData.price || 0).toFixed(2)} CAD</p>

//               {bookData.description && (
//                 <p
//                   className="book-description"
//                   style={{
//                     fontSize: "0.9em",
//                     color: "#666",
//                     marginTop: "0.5em",
//                     display: "-webkit-box",
//                     WebkitLineClamp: 2,
//                     WebkitBoxOrient: "vertical",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {bookData.description}
//                 </p>
//               )}

//               <button
//                 className="add-to-cart-btn"
//                 onClick={() => handleAddToCart(book)}
//                 style={{
//                   marginTop: "1rem",
//                   padding: "0.5rem 1rem",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Add to Cart
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {books.length === 0 && !loading && (
//         <p>No books found. Please check your Strapi content.</p>
//       )}
//     </main>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Books.css"; // optional styling

// export default function Books() {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         // const res = await fetch("http://loved-rhythm-7c69d3a485.strapiapp.com/api/books?populate=*");
//         const res = await fetch("http://localhost:1337/api/books?populate=*");
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();
//         console.log("Books API Response:", data); // Debug log
//         setBooks(data.data || []);
//       } catch (err) {
//         console.error("Error fetching books:", err);
//         setError(err.message);
//         setBooks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const handleBookClick = (bookID) => {
//     navigate(`/books/${bookID}`);
//   };

//   const handleAddToCart = (book) => {
//     const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
//     const isAlreadyInCart = existingCart.some(item => item.id === book.id);
//     if (!isAlreadyInCart) {
//       localStorage.setItem("cart", JSON.stringify([...existingCart, book]));
//       alert(`Added "${book.title}" to cart!`);
//     } else {
//       alert(`"${book.title}" is already in your cart.`);
//     }
//   };

//   if (loading) {
//     return <main style={{ padding: "2rem" }}><p>Loading books...</p></main>;
//   }

//   if (error) {
//     return <main style={{ padding: "2rem" }}><p>Error loading books: {error}</p></main>;
//   }

//   return (
//     <main style={{ padding: "2rem" }}>
//       <h2>All Books</h2>
//       <div className="books-container">
//         {books.map((book) => {
//           // Safety check for book data
//           if (!book) {
//             console.warn("Invalid book data:", book);
//             return null;
//           }
//           // Book data is at root level, not under attributes
//           const b = book;
          
//           // Use filename for local images since your data shows filename field
//           const cover = b.filename
//             ? `http://loved-rhythm-7c69d3a485.strapiapp.com/assets/images/book-covers/${b.filename}`
//             : null; 
//             // ? `${import.meta.env.BASE_URL}assets/images/book-covers/${b.filename}`
//             // : null;

//           return (
//             <div key={book.id} className="book-card">
//               {cover && (
//                 <img
//                   src={cover}
//                   alt={b.title || "Book cover"}
//                   onClick={() => handleBookClick(book.id)}
//                   style={{ cursor: "pointer", width: "200px" }}
//                 />
//               )}
//               <h4>{b.title || "Unknown Title"}</h4>
//               <p><em>{b.author || "Unknown Author"}</em></p>
//               <p>${b.price_cad?.toFixed(2) || "0.00"} CAD</p>
//               <button className="add-to-cart-btn" onClick={() => handleAddToCart(book)}>
//                 Add to Cart
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </main>
//   );
// }
