// Home.jsx
import React from "react";
import NewBooks from "../Books/NewBooks";
import Header from "../../components/Header/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <NewBooks />
    </div>
  );
}

