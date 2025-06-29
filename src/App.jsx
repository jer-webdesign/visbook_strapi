import './App.css';
import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookDetail from './pages/Books/BookDetail';
import Home from './pages/Home/Home';
import Books from './pages/Books/Books';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Cart from './pages/Cart/Cart';

export default function App() {

  return (
    <Router basename="/responsive_nav_menu_strapi">
      <NavBar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:bookID" element={<BookDetail />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cart" element={<Cart />} />             
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}