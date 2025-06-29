import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewBooks.css";

export default function NewBooks() {
  const newBooksRef = useRef(null);
  const bestSellersRef = useRef(null);
  const navigate = useNavigate();
  const scrollByAmount = 236;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true); // Replace with live URL if needed
        // const res = await fetch("http://localhost:1337/api/books?populate=*");
        const res = await fetch("https://loved-rhythm-7c69d3a485.strapiapp.com/api/books?populate=*");        
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        console.log("Fetched data:", data);
        if (data && data.data && Array.isArray(data.data)) {
          setBooks(data.data);
        } else {
          setError("Unexpected data structure from API");
        }
      } catch (error) {
        setError(error.message);
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
    const isAlreadyInCart = existingCart.some((item) => item.id === book.id);
    if (!isAlreadyInCart) {
      const updatedCart = [...existingCart, book];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      alert(`Added "${book.title}" to cart!`);
    } else {
      alert(`"${book.title}" is already in your cart.`);
    }
  };

  // Initialize carousel to start at the first duplicate set
  const initializeCarousel = (ref, originalLength) => {
    if (!ref.current || originalLength === 0) return;
    // Temporarily disable smooth scrolling for initialization
    const container = ref.current;
    const originalBehavior = container.style.scrollBehavior;
    container.style.scrollBehavior = "auto";
    
    // Start at the beginning of the second set (first duplicate)
    container.scrollLeft = originalLength * scrollByAmount;
    
    // Restore original scroll behavior
    container.style.scrollBehavior = originalBehavior;
  };

  // True infinite scroll with seamless looping
  const handleInfiniteScroll = (ref, originalLength) => {
    if (!ref.current || originalLength === 0) return;

    const container = ref.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = scrollByAmount;
    const singleSetWidth = originalLength * itemWidth;

    // If we've scrolled past the end of the second set, reset to the beginning of the second set
    if (scrollLeft >= singleSetWidth * 2) {
      container.scrollLeft = singleSetWidth;
    }
    // If we've scrolled before the beginning of the second set, reset to the end of the second set
    else if (scrollLeft < singleSetWidth) {
      container.scrollLeft = singleSetWidth * 2 - itemWidth;
    }
  };

  const scrollLeft = (ref, originalLength) => {
    if (!ref.current || originalLength === 0) return;
    
    // Disable smooth scrolling temporarily for the repositioning
    const container = ref.current;
    const originalBehavior = container.style.scrollBehavior;
    
    // Perform the scroll
    container.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
    
    // Check for infinite scroll after animation
    setTimeout(() => {
      container.style.scrollBehavior = "auto";
      handleInfiniteScroll(ref, originalLength);
      container.style.scrollBehavior = originalBehavior;
    }, 300);
  };

  const scrollRight = (ref, originalLength) => {
    if (!ref.current || originalLength === 0) return;
    
    // Disable smooth scrolling temporarily for the repositioning
    const container = ref.current;
    const originalBehavior = container.style.scrollBehavior;
    
    // Perform the scroll
    container.scrollBy({ left: scrollByAmount, behavior: "smooth" });
    
    // Check for infinite scroll after animation
    setTimeout(() => {
      container.style.scrollBehavior = "auto";
      handleInfiniteScroll(ref, originalLength);
      container.style.scrollBehavior = originalBehavior;
    }, 300);
  };

  // Filtering books at root level
  const newReleases = books.filter((book) => book && book.isNewRelease);
  const bestSellers = books.filter((book) => book && book.isBestSeller);

  // Initialize carousels when data is ready
  useEffect(() => {
    if (newReleases.length > 0) {
      // Initialize immediately without delay
      initializeCarousel(newBooksRef, newReleases.length);
    }
    if (bestSellers.length > 0) {
      // Initialize immediately without delay
      initializeCarousel(bestSellersRef, bestSellers.length);
    }
  }, [newReleases.length, bestSellers.length]);

  // Create triple array for true infinite scrolling
  const createInfiniteArray = (bookList) => {
    if (bookList.length === 0) return [];
    return [...bookList, ...bookList, ...bookList];
  };

  const renderBookItem = (book, index, originalId) => {
    if (!book) {
      console.warn("Invalid book data:", book);
      return null;
    }

    // const cover = book.media_url?.url
      // ? `http://localhost:1337${book.media_url.url}`
      // : null;   
    const cover = book.filename       
      ? `https://loved-rhythm-7c69d3a485.media.strapiapp.com/${book.filename}`
      : null;

    return (
      <article key={`${originalId}-${index}`} className="book">
        <figure
          onClick={() => handleBookClick(originalId)}
          style={{ cursor: "pointer" }}
        >
          {cover ? (
            <img
              src={cover}
              alt={`Cover of ${book.title}`}
              width={200}
              height="auto"
            />
          ) : (
            <div
              style={{
                width: 200,
                height: 300,
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No Image
            </div>
          )}
          <figcaption>
            <h4>{book.title}</h4>
            <p>
              <em>{book.author}</em>
            </p>
            <p>${book.price_cad?.toFixed(2)} CAD</p>
          </figcaption>
        </figure>
        <button
          className="add-to-cart-btn"
          onClick={() => handleAddToCart(book)}
        >
          Add to Cart
        </button>
      </article>
    );
  };

  const renderBookCarousel = (bookList, ref, showArrows = true) => {
    if (bookList.length === 0) return null;
    
    const infiniteBooks = createInfiniteArray(bookList);

    return (
      <section className="book-list">
        {showArrows && (
          <button
            className="scroll-arrow left-arrow"
            onClick={() => scrollLeft(ref, bookList.length)}
            aria-label="Scroll left"
          >
            &#9664;
          </button>
        )}

        <section
          className="book-carousel"
          ref={ref}
          style={{ 
            overflowX: "auto", 
            display: "flex", 
            scrollBehavior: "auto", // Start with auto to prevent initial smooth scrolling
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
          onLoad={() => {
            // Enable smooth behavior after initial load
            if (ref.current) {
              ref.current.style.scrollBehavior = "smooth";
            }
          }}
        >
          {infiniteBooks.map((book, index) => {
            const originalIndex = index % bookList.length;
            return renderBookItem(book, index, book.id);
          })}
        </section>

        {showArrows && (
          <button
            className="scroll-arrow right-arrow"
            onClick={() => scrollRight(ref, bookList.length)}
            aria-label="Scroll right"
          >
            &#9654;
          </button>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <main>
        <p>Loading books...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>Error loading books: {error}</p>
      </main>
    );
  }

  return (
    <main>
      <h2>New Releases</h2>
      {newReleases.length > 0 ? (
        renderBookCarousel(newReleases, newBooksRef, true)
      ) : (
        <p>No new releases available.</p>
      )}

      <h2>Best Sellers</h2>
      {bestSellers.length > 0 ? (
        renderBookCarousel(bestSellers, bestSellersRef, true)
      ) : (
        <p>No best sellers available.</p>
      )}
    </main>
  );
}

// import { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./NewBooks.css";

// export default function NewBooks() {
//   const newBooksRef = useRef(null);
//   const bestSellersRef = useRef(null);
//   const navigate = useNavigate();
//   const scrollByAmount = 236;

//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         // const res = await fetch("http://loved-rhythm-7c69d3a485.strapiapp.com/api/books?populate=*");
//         const res = await fetch("http://localhost:1337/api/books?populate=*");
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         const data = await res.json();
        
//         // Log the data to see what we're getting
//         console.log("Fetched data:", data);
        
//         // Validate that we have the expected data structure
//         if (data && data.data && Array.isArray(data.data)) {
//           setBooks(data.data);
//         } else {
//           console.error("Unexpected data structure:", data);
//           setError("Unexpected data structure from API");
//         }
//       } catch (error) {
//         console.error("Error fetching books from Strapi:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const scrollLeft = (ref) => {
//     if (ref.current) {
//       ref.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
//     }
//   };

//   const scrollRight = (ref) => {
//     if (ref.current) {
//       ref.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
//     }
//   };

//   const handleBookClick = (bookID) => {
//     navigate(`/books/${bookID}`);
//   };

//   const handleAddToCart = (book) => {
//     const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
//     const isAlreadyInCart = existingCart.some((item) => item.id === book.id);
//     if (!isAlreadyInCart) {
//       const updatedCart = [...existingCart, book];
//       localStorage.setItem("cart", JSON.stringify(updatedCart));
//       alert(`Added "${book.title}" to cart!`);
//     } else {
//       alert(`"${book.title}" is already in your cart.`);
//     }
//   };

//   // Updated filtering - data is at root level, not under attributes
//   const newReleases = books.filter((book) => 
//     book && book.isNewRelease
//   );
//   const bestSellers = books.filter((book) => 
//     book && book.isBestSeller
//   );

//   const renderBookCarousel = (bookList, ref, showArrows = true) => (
//     <section className="book-list">
//       {showArrows && (
//         <button className="scroll-arrow left-arrow" onClick={() => scrollLeft(ref)} aria-label="Scroll left">
//           &#9664;
//         </button>
//       )}

//       <section className="book-carousel" ref={ref}>
//         {bookList.map((book) => {
//           // Safety check for book data
//           if (!book) {
//             console.warn("Invalid book data:", book);
//             return null;
//           }

//           // Book data is at root level, not under attributes
//           // const cover = book.filename 
//           // ? `http://loved-rhythm-7c69d3a485.strapiapp.com/assets/images/book-covers/${book.filename}`
//           // : null;
//           // ? `${import.meta.env.BASE_URL}assets/images/book-covers/${book.filename}`
//           // : null;

//           const cover = book.media_url?.url
//             ? `http://localhost:1337${book.media_url.url}`
//             : null;          

//           return (
//             <article key={book.id} className="book">
//               <figure onClick={() => handleBookClick(book.id)} style={{ cursor: "pointer" }}>
//                 {cover ? (
//                   <img src={cover} alt={`Cover of ${book.title}`} width={200} height="auto" />
//                 ) : (
//                   <div style={{ width: 200, height: 300, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     No Image
//                   </div>
//                 )}
//                 <figcaption>
//                   <h4>{book.title}</h4>
//                   <p><em>{book.author}</em></p>
//                   <p>${book.price_cad?.toFixed(2)} CAD</p>
//                 </figcaption>
//               </figure>
//               <button className="add-to-cart-btn" onClick={() => handleAddToCart(book)}>Add to Cart</button>
//             </article>
//           );
//         })}
//       </section>

//       {showArrows && (
//         <button className="scroll-arrow right-arrow" onClick={() => scrollRight(ref)} aria-label="Scroll right">
//           &#9654;
//         </button>
//       )}
//     </section>
//   );

//   // Handle loading and error states
//   if (loading) {
//     return <main><p>Loading books...</p></main>;
//   }

//   if (error) {
//     return <main><p>Error loading books: {error}</p></main>;
//   }

//   return (
//     <main>
//       <h2>New Releases</h2>
//       {newReleases.length > 0 ? (
//         renderBookCarousel(newReleases, newBooksRef, true)
//       ) : (
//         <p>No new releases available.</p>
//       )}

//       <h2>Best Sellers</h2>
//       {bestSellers.length > 0 ? (
//         renderBookCarousel(bestSellers, bestSellersRef, true)
//       ) : (
//         <p>No best sellers available.</p>
//       )}
//     </main>
//   );
// }
