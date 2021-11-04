import * as React from "react";

function NextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g id="next-episode">
        <path
          fill="currentColor"
          d="M18,4 L20,4 L20,20 L18,20 L18,4 Z M6,16.4208712 L13.1839156,12 L6,7.57912885 L6,16.4208712 Z M4,4 L17,12 L4,20 L4,4 Z"
        ></path>
      </g>
    </svg>
  );
}

export default NextIcon;
