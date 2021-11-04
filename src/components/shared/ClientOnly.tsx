import React, { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

// https://stackoverflow.com/questions/58293542/next-js-warning-expected-server-html-to-contain-a-matching-a-in-div-how-to
const ClientOnly: React.FC<Props> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted ? <React.Fragment>{children}</React.Fragment> : null;
};
export default ClientOnly;
