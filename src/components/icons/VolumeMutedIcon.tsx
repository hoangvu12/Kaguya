import * as React from "react";

function VolumeMutedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g id="volume-off">
        <path
          fill="currentColor"
          d="M9,7.82842712 L6.82842712,10 L4,10 L4,14 L6.82842712,14 L9,16.1715729 L9,7.82842712 Z M11,21 L6,16 L2,16 L2,8 L6,8 L11,3 L11,21 Z M17,10.5857864 L20.2928932,7.29289322 L21.7071068,8.70710678 L18.4142136,12 L21.7071068,15.2928932 L20.2928932,16.7071068 L17,13.4142136 L13.7071068,16.7071068 L12.2928932,15.2928932 L15.5857864,12 L12.2928932,8.70710678 L13.7071068,7.29289322 L17,10.5857864 Z"
        ></path>
      </g>
    </svg>
  );
}

export default VolumeMutedIcon;
