import * as React from "react";
import { SVGProps, memo } from "react";

const SliderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="iconify iconify--uil"
    width={32}
    height={32}
    viewBox="0 0 24 24"
    style={{ width: "100%", height: "100%" }}
    {...props}
  >
    <path
      fill="currentColor"
      d="M21 11h-3.184a2.982 2.982 0 0 0-5.632 0H3a1 1 0 0 0 0 2h9.184a2.982 2.982 0 0 0 5.632 0H21a1 1 0 0 0 0-2Zm-6 2a1 1 0 1 1 1-1 1.001 1.001 0 0 1-1 1Z"
    />
  </svg>
);

export default memo(SliderIcon);
