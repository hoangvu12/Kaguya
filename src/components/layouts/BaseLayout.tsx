import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useRouter } from "next/dist/client/router";
import React from "react";
import Header from "../partials/Header";

const variants = {
  hidden: { opacity: 0, y: -100 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
};

const BaseLayout: React.FC = ({ children }) => {
  return (
    <main>
      <Header />

      <div className="app">{children}</div>
    </main>
  );
};

export default BaseLayout;
