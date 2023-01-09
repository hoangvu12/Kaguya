import React from "react";
import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/Header";
import Announcement from "../partials/Announcement";

interface BaseLayoutProps {
  showHeader?: boolean;
  showFooter?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  showFooter = true,
  showHeader = true,
}) => {
  return (
    <main>
      <Announcement />

      {showHeader && <Header />}

      <div className="app">{children}</div>

      {showFooter && <Footer />}
    </main>
  );
};

export default BaseLayout;
