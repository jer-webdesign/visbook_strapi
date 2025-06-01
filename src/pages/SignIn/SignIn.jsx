// SignIn.jsx
import React, { useState } from "react";
import "./SignIn.css"; 

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Example validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address.");
      return;
    }

    setError("");
    console.log("Signing in with:", formData);
  };

  return (
    <div className="signin-container">
      <h2>Sign in to your account</h2>
      <form onSubmit={handleSubmit} className="signin-form">
        {error && <div className="error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}