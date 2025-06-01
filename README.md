# Responsive Navigation Menu

## Overview
This project is a responsive navigation menu built with Vite + React. It features a hamburger menu for mobile viewports, animated transitions that hover and highlight the buttons, and client-side routing using React Router.

This is a Visual Graphic online bookstore website named **visbook**.

## Features
- Responsive navigation bar
- Hamburger menu for small screens
- Smooth CSS animations for menu transitions
- React Router for client-side navigation
- JSON-based product data loading for book covers and information (book titles, subtitles, authors, prices, etc.)
- Book covers scrollable using navigation buttons

## Setup Instructions
Before you begin, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

You can set up the project using [Vite](https://vitejs.dev/) and install React along with React Router DOM. 
Before you begin, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

You can set up the project using [Vite](https://vitejs.dev/) and install React along with React Router DOM.
Before you begin, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

You can set up the project using [Vite](https://vitejs.dev/) and install React along with React Router DOM.
1. Clone the repository
2. Navigate into the project directory and run `npm create vite@latest` to initialize with React template
3. Install dependencies:

   npm install
   npm install react-router-dom

2. Run `npm install`
3. Start the development server with `npm run dev`
4. To deploy the site to GitHub Pages: (LogRocket tutorial](https://blog.logrocket.com/gh-pages-react-apps/)
   - Install the gh-pages package:
     npm install gh-pages --save-dev

   - Add the following scripts to your `package.json`:
     ```json
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }

   - Run the command:
     npm run deploy


## Pages
- Home
- About
- Contact
- Books
- Sign In
- Sign Up
- Cart

## Technologies Used
- Vite
- React
- React Router DOM
- CSS3

## Key Concepts and Hooks Used
- `useState` and `useEffect` from React
- `useRef` and `useNavigate` for scrolling book covers horizontally (left and right)
- `localStorage.getItem()` for retrieving persisted data
- `JSON.parse()` for parsing external JSON files

## Accessibility Considerations
- Clear focus states
- Keyboard navigation for menu
- Responsive layout across devices

## Design Inspiration
- [3DTotal Store](https://store.3dtotal.com/)
- [Indigo](https://www.indigo.ca/en-ca/)

## Attributions & References

  W3Schools. (n.d.). HTML Web Storage - localStorage. https://www.w3schools.com/html/html5_webstorage.asp
  
  LogRocket. (2025, May 28). How to deploy React apps to GitHub Pages. LogRocket Blog. https://blog.logrocket.com/gh-pages-react-apps/

  React. (n.d.). useRef – React documentation. https://react.dev/reference/react/useRef

  React Router. (n.d.). useNavigate – React Router documentation. https://reactrouter.com/api/hooks/useNavigate

  3DTotal Store. (n.d.). 3DTotal Store. https://store.3dtotal.com/

  Indigo. (n.d.). Indigo. https://www.indigo.ca/en-ca/

  Canva. (n.d.). Canva. https://www.canva.com/


