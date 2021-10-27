import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  element?: HTMLElement;
}

const Portal: React.FC<PortalProps> = ({ children, element }) => {
  const [el, setEl] = useState(null);

  useEffect(() => {
    setEl(element || document.querySelector("main"));
  }, []);

  return el ? ReactDOM.createPortal(children, el) : null;
};

export default Portal;
