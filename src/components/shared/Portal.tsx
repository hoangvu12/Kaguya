import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  selector?: string;
}

const Portal: React.FC<PortalProps> = ({ children, selector = "body" }) => {
  const [el, setEl] = useState(null);

  useEffect(() => {
    setEl(document.querySelector(selector));
  }, [selector]);

  return el ? ReactDOM.createPortal(children, el) : null;
};

export default React.memo(Portal);
