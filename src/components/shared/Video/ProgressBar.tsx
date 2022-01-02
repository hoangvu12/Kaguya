import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Direction, Slider } from "react-player-controls";

type ChildrenBars = {
  backgroundBar: React.ReactNode;
  playedBar: React.ReactNode;
  handle: React.ReactNode;
};
interface ProgressBarProps {
  onChange?: (percent: number) => void;
  onChangeStart?: (percent: number) => void;
  onChangeEnd?: (percent: number) => void;
  onIntent?: (percent: number) => void;
  onIntentStart?: (percent: number) => void;
  onIntentEnd?: (percent: number) => void;
  className?: string;
  value?: number;
  children: ({
    backgroundBar,
    playedBar,
    handle,
  }: ChildrenBars) => React.ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  onChange,
  className,
  value,
  children,
  ...props
}) => {
  const [progress, setProgress] = useState(value);
  const { isMobile } = useDevice();

  useEffect(() => {
    setProgress(value);
  }, [value]);

  const handleProgress = (percent: number) => {
    setProgress(percent);
    onChange?.(percent);
  };

  return (
    <Slider
      isEnabled
      direction={Direction.HORIZONTAL}
      onChange={handleProgress}
      className={classNames("relative group cursor-pointer", className)}
      {...props}
    >
      {children({
        backgroundBar: <Bar className="bg-white/20 rounded-sm w-full" />,
        playedBar: (
          <Bar
            className="bg-primary-500 rounded-sm"
            style={{ width: `${progress * 100}%` }}
          />
        ),
        handle: (
          <Handle
            className={classNames(
              "transition duration-100 bg-primary-500",
              !isMobile && "scale-0 group-hover:scale-100"
            )}
            style={{
              marginLeft: `calc(${progress * 100}% - 0.5rem)`,
            }}
          />
        ),
      })}
    </Slider>
  );
};

export const Bar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={classNames("absolute h-full", className)} {...props} />;

export const Handle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={classNames(
      "absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full",
      className
    )}
    {...props}
  />
);

export default React.memo(ProgressBar);
