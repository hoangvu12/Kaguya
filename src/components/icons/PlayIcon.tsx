import * as React from "react";

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g id="play">
        <polygon fill="currentColor" points="6 4 21 12 6 20"></polygon>
      </g>
    </svg>
  );
}

export default SvgComponent;
