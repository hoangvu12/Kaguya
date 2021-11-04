import * as React from "react";

function EpisodesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g id="episodes">
        <path
          fill="currentColor"
          d="M24,5 L24,13 L22,13 L22,5 L8,5 L8,3 L24,3 L24,5 Z M20,9 L20,17 L18,17 L18,9 L4,9 L4,7 L20,7 L20,9 Z M2,13 L2,19 L14,19 L14,13 L2,13 Z M0,11 L16,11 L16,21 L0,21 L0,11 Z"
        ></path>
      </g>
    </svg>
  );
}

export default EpisodesIcon;
