import * as React from "react";
import { SVGProps, memo } from "react";

const MarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="iconify iconify--material-symbols"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="m7 17.95 5-2.15 5 2.15V5H7ZM5 21V5q0-.825.588-1.413Q6.175 3 7 3h10q.825 0 1.413.587Q19 4.175 19 5v16l-7-3ZM17 5H7h10Z"
    />
  </svg>
);

const Memo = memo(MarkIcon);
export default Memo;
