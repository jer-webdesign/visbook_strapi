Assignment #1: Responsive Navigation Menu
Overview
This project is a responsive navigation menu built with Vite + React. It features a hamburger menu for mobile viewports, animated transitions that hover and highlight the buttons, and client-side routing using React Router.

This is a Visual Graphic online bookstore website named VISBOOK.

Features
Responsive navigation bar
Hamburger menu for small screens
Smooth CSS animations for menu transitions
React Router for client-side navigation
JSON-based product data loading for book covers and information (book titles, subtitles, authors, prices, etc.)
Book covers scrollable using navigation buttons
Images are stored inside the public folder, not inside src, to simplify asset management and referencing in production builds.
Setup Instructions
Before you begin, make sure you have Node.js installed on your machine.

Set up the project using Vite and install React along with React Router DOM.

Clone the repository

Navigate into the project directory and run:

npm create vite@latest

Select the React template.

Install dependencies:

npm install react-router-dom npm install

Start the development server with:

npm run dev

Deploy to GitHub Pages
To deploy the site to GitHub Pages, follow these steps:

Install the gh-pages package:

npm install gh-pages --save-dev

Add the following scripts to your package.json:

"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
"homepage": "https://github.com/[GitHub username]/[repository name]"
Run the deployment command:

npm run deploy

Important for GitHub Pages Routing
If running on GitHub Pages, replace BrowserRouter with HashRouter in your React Router setup:

import { HashRouter as Router } from 'react-router-dom';


#### Why use HashRouter?

GitHub Pages serves static files and does not support server-side routing, which causes `BrowserRouter`
to fail with 404 errors on page reloads or direct URL access.

`HashRouter` uses the URL hash (`#`) portion to simulate routing entirely on the client side,
preventing 404 errors by keeping the URL path consistent from the server's perspective.

---

## Pages

- Home
- About
- Contact
- Books
- Sign In
- Sign Up
- Cart

 Technologies Used

- Vite
- React
- React Router DOM
- CSS3

 Key Concepts and Hooks Used

- `useState` and `useEffect` from React
- `useRef` and `useNavigate` for scrolling book covers horizontally (left and right)
- `localStorage.getItem()` for retrieving persisted data
- `JSON.parse()` for parsing external JSON files
- HashRouter as Router

Accessibility Considerations

- Clear focus states
- Keyboard navigation for menu
- Responsive layout across devices

## Design Inspiration

- 3DTotal Store (https://store.3dtotal.com/)
- Indigo (https://www.indigo.ca/en-ca/)

 Attributions & References

- W3Schools. (n.d.). HTML Web Storage - localStorage. https://www.w3schools.com/html/html5_webstorage.asp

- LogRocket. (2025, May 28). How to deploy React apps to GitHub Pages.
  LogRocket Blog. https://blog.logrocket.com/gh-pages-react-apps/

- React. (n.d.). useRef – React documentation. https://react.dev/reference/react/useRef

- React Router. (n.d.). useNavigate – React Router documentation.
  https://reactrouter.com/api/hooks/useNavigate

- React Router. (n.d.). HashRouter – React Router documentation.
  https://reactrouter.com/en/main/router-components/hash-router

- Stack Overflow. (n.d.). Why does React Router give a 404 error on GitHub Pages?
  https://stackoverflow.com/questions/49346783/react-router-on-github-pages-giving-404-error

- 3DTotal Store. (n.d.). 3DTotal Store. https://store.3dtotal.com/

- Indigo. (n.d.). Indigo. https://www.indigo.ca/en-ca/

- Canva. (n.d.). Canva. https://www.canva.com/