import classNames from "classnames";
import React, { Children, useEffect, useState } from "react";
import { Slider, Direction } from "react-player-controls";

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

  useEffect(() => {
    setProgress(value);
  }, [value]);

  const handleProgress = (percent: number) => {
    setProgress(percent);
    onChange(percent);
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
        backgroundBar: <Bar className="bg-white/20 rounded-sm" />,
        playedBar: (
          <Bar
            className="bg-primary-500 rounded-sm"
            style={{ width: `${progress * 100}%` }}
          />
        ),
        handle: (
          <BarHandle
            className="scale-0 group-hover:scale-100 transition duration-100 bg-primary-500"
            style={{
              left: `calc(${progress * 100}% - 0.5rem)`,
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
}) => (
  <div
    className={classNames(
      "absolute top-0 left-0 bottom-0 w-full h-full",
      className
    )}
    {...props}
  />
);

export const BarHandle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
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
