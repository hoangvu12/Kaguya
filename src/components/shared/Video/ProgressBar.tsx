import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { getTrackBackground, Range } from "react-range";
import { IThumbProps, ITrackProps } from "react-range/lib/types";

interface VideoTrackProps extends ITrackProps {
  value: number;
  children: React.ReactNode;
  isDragged: boolean;
  disabled: boolean;
  min?: number;
  max?: number;
}

interface ProgressBarProps {
  onChange?: (value: number) => void;
  onSeek?: (value: number) => void;
  value: number;
  min?: number;
  max?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  onChange,
  onSeek,
  value = 0,
  min = 0,
  max = 100,
}) => {
  const [progressValue, setProgressValue] = useState(value);

  useEffect(() => {
    setProgressValue(value);
  }, [value]);

  return (
    <Range
      step={0.1}
      min={min}
      max={max}
      values={[progressValue]}
      onFinalChange={(values) => {
        onChange?.(values[0]);
      }}
      onChange={(values) => {
        setProgressValue(values[0]);

        onSeek?.(values[0]);
      }}
      renderTrack={({ props, children, ...rest }) => (
        <VideoProgressTrack
          min={min}
          max={max}
          value={progressValue}
          {...props}
          {...rest}
        >
          {children}
        </VideoProgressTrack>
      )}
      renderThumb={({ props }) => <VideoProgressThumb {...props} />}
    />
  );
};

const VideoProgressTrack = React.forwardRef<HTMLDivElement, VideoTrackProps>(
  ({ isDragged, children, value, min, max, ...props }, ref) => {
    return (
      <motion.div
        {...props}
        ref={ref}
        className="cursor-pointer bg-primary-500 w-full"
        style={{
          // @ts-ignore
          backgroundImage: getTrackBackground({
            values: [value],
            colors: ["#EF4444", "#D3D3D3"],
            min,
            max,
          }),
        }}
        animate={{ height: isDragged ? "0.35rem" : "0.25rem" }}
        transition={{ ease: "linear", duration: 0.15 }}
      >
        {children}
      </motion.div>
    );
  }
);

const VideoProgressThumb = React.forwardRef<HTMLDivElement, IThumbProps>(
  (props, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className="w-4 h-4 rounded-full bg-primary-500 focus:border-none focus:outline-none"
      />
    );
  }
);

VideoProgressThumb.displayName = "VideoProgressThumb";
VideoProgressTrack.displayName = "VideoProgressTrack";

export default React.memo(ProgressBar);
