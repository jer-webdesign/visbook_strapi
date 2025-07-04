
# Visbook - Responsive Online Visual Graphics Bookstore Documentation

## 1. Brief Description
Visbook is a modern, responsive online bookstore developed to showcase and sell visual graphics books. The application is designed to deliver a seamless user experience for browsing, searching, and purchasing books related to visual arts, design, and graphics. The platform integrates with STRAPI Cloud for content management and Firebase for authentication and order management, following best practices for modern web development.

## 2. Features
- Provides user authentication (Sign Up/Sign In with email/password) using Firebase.
- Allows users to browse, search, and view detailed information for each book.
- Enables users to add books to a cart and complete purchases.
- Maintains order history and account management features.
- Implements a responsive navigation menu and layout for all devices.
- Supports admin management of book data via STRAPI Cloud.
- Simulates a secure payment workflow for demonstration purposes.

## 3. Technologies Used
- React (Vite)
- React Router
- STRAPI Cloud (Headless CMS, PostgreSQL)
- Firebase Authentication
- Firestore Database
- Custom modular CSS
- Render (deployment)

## 4. Project & Code Structure
```
visbook_strapi/
├── public/
│   ├── assets/
│   │   └── images/
│   │       ├── vblogo.png
│   │       ├── visbook-about.jpg
│   │       ├── visbook-banner.jpg
│   │       └── icons/
│   │           ├── book-icon.png
│   │           ├── cart-icon.png
│   │           ├── contact-icon.png
│   │           ├── home-icon.png
│   │           ├── signin-icon.png
│   │           ├── signup-icon.png
│   │           ├── about-icon.png
│   │           └── info-icon.png
│   └── visbook.png
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── firebase.js
│   ├── main.jsx
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   ├── Modal/
│   │   │   ├── Modal.jsx
│   │   │   └── Modal.css
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── data/
│   │   └── visbook.csv
│   └── pages/
│       ├── Home/
│       │   ├── Home.jsx
│       │   └── Home.css
│       ├── Books/
│       │   ├── Books.jsx
│       │   ├── Books.css
│       │   ├── BookDetail.jsx
│       │   ├── BookDetail.css
│       │   ├── NewBooks.jsx
│       │   └── NewBooks.css
│       ├── About/
│       │   ├── About.jsx
│       │   └── About.css
│       ├── Contact/
│       │   ├── Contact.jsx
│       │   └── Contact.css
│       ├── Cart/
│       │   ├── Cart.jsx
│       │   └── Cart.css
│       ├── Account/
│       │   ├── AccountSettings.jsx
│       │   └── AccountSettings.css
│       ├── OrderHistory/
│       │   ├── OrderHistory.jsx
│       │   └── OrderHistory.css
│       ├── Payment/
│       │   ├── Payment.jsx
│       │   ├── Payment.css
│       │   ├── PaymentCompleted.jsx
│       │   └── PaymentCompleted.css
│       ├── SignIn/
│       │   ├── SignIn.jsx
│       │   └── SignIn.css
│       ├── SignUp/
│       │   ├── SignUp.jsx
│       │   └── SignUp.css
├── .env
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 5. Software Component Roles
- **Navbar, Footer, Modal:** These are reusable UI components for navigation, layout, and dialogs.
- **Pages:** Each folder in `src/pages` corresponds to a route/view (e.g., Home, Books, Cart).
- **firebase.js:** Handles Firebase and Firestore configuration.
- **context/AuthContext.jsx:** Manages user authentication state using React Context.
- **STRAPI Cloud:** Provides book data management (CRUD) and media asset hosting.

## 6. Logical Architecture (Visual)
```
[User] ⇄ [React Frontend] ⇄ [STRAPI Cloud API] ⇄ [PostgreSQL]
                   ⇅ [Firebase Auth]
                   ⇅ [Firestore DB]
```

## 7. Installation and Dependencies
- Clone the repository from source control.
- Run `npm install` in the project root to install all dependencies.
- Refer to `package.json` for a complete list of required packages.

## 8. STRAPI Cloud Setup & Book Data Management

### 8.1. STRAPI Cloud Project Setup
To set up the STRAPI Cloud backend, the developer should:
- Sign up or log in at https://cloud.strapi.io/.
- Create a new project and select the appropriate plan (free or paid).
- Use PostgreSQL as the database (provided by STRAPI Cloud).
- Deploy backend code from the `backend-postgresql-strapi` GitHub repository to cloud.strapi.io/projects.
- Wait for provisioning and note the unique STRAPI Cloud URL (e.g., `https://your-project-name.cloud.strapi.io`).

### 8.2. Configure Book Collection Type
- In the STRAPI admin panel, navigate to "Content-Type Builder" and create a new collection type named `Book`.
- Add fields such as Title, Subtitle, Cover Image, Price, Published Date, Description, Author, and any additional fields required (e.g., ISBN, category, tags).
- Save and apply changes; STRAPI will update the database schema automatically.

### 8.3. Add Book Data
- In the Content Manager, add book entries manually or use the provided `visbookData.js` script (from the backend codebase) to bulk import data from `visbook.csv`.
- Upload book cover images to the STRAPI Media Library.
- For each book, ensure the filename in the Content Manager matches the Media Library filename, and update the book entry with the correct image URL.
- Save each entry. Repeat as needed for all books.

### 8.4. Set API Permissions
- In "Settings" > "Roles" > "Public", enable `find` and `findOne` permissions for the `Book` collection to allow frontend access.
- Save the updated permissions.

### 8.5. Fetch Book Data from React Frontend
- The frontend fetches book data from the Strapi REST API, enabling real-time updates and centralized content management. Example code for fetching all book entries in a React component:
  ```js
  useEffect(() => {
    fetch('https://your-project-name.cloud.strapi.io/api/books?populate=*')
      .then(res => res.json())
      .then(data => setBooks(data.data));
  }, []);
  ```
- Each book entry is accessed as an object in the `data` array returned by the API. To display book details, map over the `books` state and access each field via `book.attributes`. Use the filename or cover image URL from the Media Library for images.
- This approach ensures the frontend always displays the latest book data managed in Strapi Cloud, without redeployment or static file updates.

### 8.6. STRAPI Cloud Media Management
- All uploaded images are managed and served by STRAPI Cloud. The API response for each book includes a URL to the cover image, which can be used directly in React components.

### 8.7. Updating and Managing Book Data
- The STRAPI admin panel allows editing, deleting, or adding new books at any time. Changes are reflected immediately in the API and on the website.

### 8.8. Security and Best Practices
- For production deployments, restrict write permissions to authenticated users only.
- Store the STRAPI API base URL in environment variables within the React app for security.

## 9. Firebase Setup/Installation & Authentication

### 9.1. Firebase Project Setup
To set up Firebase, the developer should:
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Create a new project (Google Analytics is optional).
- Register the app (web icon) and obtain the Firebase config object.
- Paste the config object into `src/firebase.js` in the React project.

### 9.2. Enable Authentication Providers
- In the Firebase Console, navigate to "Build" > "Authentication" > "Get started".
- Enable "Email/Password" and optionally "Google" providers under the "Sign-in method" tab.
- Configure additional settings as needed (e.g., email verification, password reset).

### 9.3. Install Firebase SDK
- In the project root, run:
  ```sh
  npm install firebase
  ```
- Import and initialize Firebase in `src/firebase.js`:
  ```js
  import { initializeApp } from 'firebase/app';
  import { getAuth } from 'firebase/auth';
  const firebaseConfig = { /* your config here */ };
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  ```

### 9.4. Authentication Usage in Code
- Use Firebase Auth methods for sign-up, sign-in, and sign-out in React components. Example for email/password sign-in:
  ```js
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../firebase';
  // ...
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // Save user info to context or state
    })
    .catch((error) => {
      // Handle errors
    });
  ```
- For Google sign-in:
  ```js
  import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // Google user info in result.user
    })
    .catch((error) => {
      // Handle errors
    });
  ```

### 9.5. User Profile Management
- Firebase Auth manages user accounts and securely stores user profile information (email, display name, etc.). The current user can be accessed anywhere in the app using:
  ```js
  import { onAuthStateChanged } from 'firebase/auth';
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
    } else {
      // User is signed out
    }
  });
  ```
- Store user info in React context (e.g., `AuthContext.jsx`) for global access.

### 9.6. Security and Best Practices
- Sensitive Firebase config or API keys should never be exposed in public repositories.
- Use Firebase Authentication rules to restrict access to user data as needed.
- Always handle authentication errors gracefully in the UI.

## 10. Firestore Database Setup & Order History
- Enable Firestore Database in the Firebase console.
- Use Firestore in code to save and retrieve order history. Example:
  ```js
  import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
  // Save order
  await addDoc(collection(db, 'orders'), orderData);
  // Retrieve orders
  const querySnapshot = await getDocs(collection(db, 'orders'));
  ```

## 11. Usage of the Website

- Users can browse the homepage to see featured and new release books, or navigate to the Books page to view the full catalog.
- Each book entry displays a cover image, title, author, price, and a link to a detailed view.
- The Book Detail page provides comprehensive information, including description, publisher, published year, ratings, and purchase options.
- Users can add books to their cart and proceed to checkout. The Cart page summarizes selected items and total price.
- To purchase, users must sign up or sign in using email/password or Google authentication (handled by Firebase Auth).
- After successful payment, order details are saved to Firestore and users are redirected to a payment confirmation page.
- The payment process is a simulation only and does not connect to any real bank account or payment gateway. It is intended for educational and demonstration purposes only.
- Users can view their order history and manage their account settings from the Account page.
- The site is fully navigable via the responsive Navbar and Footer, with clear links to About, Contact, and other informational pages.

### Contact Form & Automated Email Replies
- When a user submits a message through the Contact page, the system automatically sends an email reply to the user's provided email address.
- This is handled by a Firebase Cloud Function, which is triggered by a new entry in the `contactMessages` Firestore collection.
- The function uses SendGrid (with a secure API key) to send a professional auto-reply, confirming receipt of the user's message and providing further instructions.
- The auto-reply email also advises users to check their Spam or Junk folder and mark the message as 'Not Spam' to ensure future delivery.
- All sensitive email credentials are managed securely using Firebase environment config and are not stored in the codebase.

#### How the Automated Email Reply Works
1. When a user submits the Contact form, their message is saved to the `contactMessages` collection in Firestore.
2. A Firebase Cloud Function (deployed in the `/functions` directory) listens for new documents in this collection and sends an auto-reply email to the user.
3. The email is sent using SendGrid, which is configured with a secure API key and sender address (never hardcoded in the codebase).
4. The auto-reply email confirms receipt and provides further instructions, and reminds users to check their Spam/Junk folder.

#### Setup & Installation (for maintainers)
1. Install nodemailer and @sendgrid/mail in the Cloud Functions directory:
   ```sh
   cd functions
   npm install nodemailer @sendgrid/mail
   ```
2. Create a SendGrid account:
   - Sign up at https://sendgrid.com/.
   - Verify your email and set up a Sender Identity (domain or single sender).
   - Generate an API key with "Full Access" or at least "Mail Send" permissions.
3. Configure Firebase environment variables for SendGrid:
   - In the Cloud Functions directory, set environment config (replace with your actual values):
     ```sh
     firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY" sendgrid.sender="your_verified_sender@example.com"
     ```
   - Deploy the config:
     ```sh
     firebase deploy --only functions
     ```
4. API Setup:
   - The Cloud Function uses the SendGrid API to send emails. No additional API setup is needed beyond the API key and sender verification.
   - All API calls are made server-side from the Cloud Function, keeping credentials secure.

**Note:**
- The frontend never has access to email credentials or API keys.
- If the SendGrid sender or API key changes, update the Firebase config and redeploy the function.

## 12. API Integration
- The frontend communicates with the Strapi Cloud REST API to fetch book data, including all fields and cover image URLs.
- User authentication and profile management are handled via the Firebase Authentication API.
- Order history and user-specific data are stored and retrieved using the Firestore API.
- All API calls are made securely from the frontend, with sensitive keys and endpoints managed via environment variables.
- The integration ensures real-time updates: new books or changes in Strapi, or new orders in Firestore, are reflected immediately on the site without redeployment.

## 13. Accessibility Considerations & Responsive Design
The Visbook platform is built to be accessible and responsive for all users, regardless of device or ability. The development team implemented a mobile-first, responsive CSS strategy to ensure seamless usability on phones, tablets, and desktops. Navigation menus are fully keyboard accessible, with clear focus states and strong color contrast to support users with varying needs. All buttons and forms are touch-friendly, and images are optimized with descriptive alt text. The site is tested across major browsers and screen sizes to deliver a consistent and reliable experience for everyone.

## 14. Design Inspiration
- 3DTotal Store (https://store.3dtotal.com/)
- Indigo (https://www.indigo.ca/en-ca/)

## 15. Deployment Notes
- The frontend React application is deployed on Render (https://render.com/) using the free tier.
- The build process is automated: on push to the main branch, Render builds and deploys the latest code.
- Environment variables for STRAPI API URL and Firebase config are set in the Render dashboard, not hardcoded in the codebase.
- The STRAPI backend is hosted on Strapi Cloud, and the database is managed by the built-in PostgreSQL instance.
- Media assets (book covers) are served from the STRAPI Cloud Media Library.
- For best performance, static assets are cached and the site uses HTTPS by default.
- The development team regularly monitors Render and Strapi Cloud dashboards for build status, errors, and usage limits.

## 16. Attributions
- React. (n.d.). useRef – React documentation. https://react.dev/reference/react/useRef
- React. (n.d.). useState – React documentation. https://react.dev/reference/react/useState
- React. (n.d.). useEffect – React documentation. https://react.dev/reference/react/useEffect
- React. (n.d.). useContext – React documentation. https://react.dev/reference/react/useContext
- React. (n.d.). useNavigate – React Router documentation. https://reactrouter.com/en/main/hooks/use-navigate
- React. (n.d.). useParams – React Router documentation. https://reactrouter.com/en/main/hooks/use-params
- React. (n.d.). useLocation – React Router documentation. https://reactrouter.com/en/main/hooks/use-location
- React. (n.d.). Router – React Router documentation. https://reactrouter.com/en/main/routers/router
- React. (n.d.). Routes – React Router documentation. https://reactrouter.com/en/main/routers/routes
- React. (n.d.). Route – React Router documentation. https://reactrouter.com/en/main/routers/route
- Strapi. (n.d.). Strapi [Computer software]. https://strapi.io/
- Firebase. (n.d.). Firebase [Computer software]. Google. https://firebase.google.com/
- Firestore. (n.d.). Cloud Firestore [Computer software]. Google. https://firebase.google.com/products/firestore
- Render. (n.d.). Render [Cloud platform]. https://render.com/
- SendGrid. (n.d.). SendGrid [Email delivery service]. https://sendgrid.com/
- 3DTotal Store. (n.d.). 3DTotal Store. https://store.3dtotal.com/
- Indigo. (n.d.). Indigo. https://www.indigo.ca/en-ca/
- Canva. (n.d.). Canva. https://www.canva.com/
- Google. (n.d.). Google sign-in logo [SVG image]. https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg



