import React from "react";
import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/Header";

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
      {showHeader && <Header />}

      <div className="app">{children}</div>

      {showFooter && <Footer />}
    </main>
  );
};

export default BaseLayout;
