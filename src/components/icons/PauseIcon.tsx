import * as React from "react";

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g id="pause">
        <path
          fill="currentColor"
          d="M5,3 L10,3 L10,21 L5,21 L5,3 Z M14,3 L19,3 L19,21 L14,21 L14,3 Z"
        ></path>
      </g>
    </svg>
  );
}

export default PauseIcon;
