import React from "react";
import Footer from "../partials/Footer";
import Header from "../partials/Header";

const BaseLayout: React.FC = ({ children }) => {
  return (
    <main>
      <Header />

      <div className="app">{children}</div>

      <Footer />
    </main>
  );
};

export default BaseLayout;
