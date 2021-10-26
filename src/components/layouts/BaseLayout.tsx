import React from "react";
import Header from "../partials/Header";

const BaseLayout: React.FC = ({ children }) => {
  return (
    <main>
      <Header />

      {children}
    </main>
  );
};

export default BaseLayout;
