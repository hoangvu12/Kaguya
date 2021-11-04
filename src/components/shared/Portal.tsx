import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  element?: HTMLElement;
  selector?: string;
}

const Portal: React.FC<PortalProps> = ({
  children,
  element,
  selector = "body",
}) => {
  const [el, setEl] = useState(null);

  useEffect(() => {
    if (element) {
      setEl(element);
    } else {
      setEl(document.querySelector(selector));
    }
  }, [element, selector]);

  return el ? ReactDOM.createPortal(children, el) : null;
};

export default React.memo(Portal);
