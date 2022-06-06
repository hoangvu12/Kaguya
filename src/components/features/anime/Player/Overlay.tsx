import classNames from "classnames";
import { useVideo } from "netplayer";
import * as React from "react";

interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const Overlay: React.FC<OverlayProps> = ({ className, ...props }) => {
  const { videoEl } = useVideo();

  const handleToggleVideo: React.MouseEventHandler<HTMLDivElement> =
    React.useCallback(
      (e) => {
        if (e.target !== e.currentTarget) return;

        if (!videoEl) return;

        if (videoEl.paused) {
          videoEl.play();
        } else {
          videoEl.pause();
        }
      },
      [videoEl]
    );

  return (
    <div
      onClick={handleToggleVideo}
      className={classNames("w-full h-full", className)}
      {...props}
    >
      {props.children}
    </div>
  );
};

export default Overlay;
