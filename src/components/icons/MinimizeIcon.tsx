import * as React from "react";

function MinimizeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className="prefix__minimize" viewBox="0 0 24 24" {...props}>
      <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
    </svg>
  );
}

export default MinimizeIcon;
