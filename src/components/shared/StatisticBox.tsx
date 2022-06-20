import classNames from "classnames";
import React from "react";

interface StatisticBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  Icon: React.ComponentType<{ className?: string }>;
}

const StatisticBox: React.FC<StatisticBoxProps> = ({
  className,
  title,
  value,
  Icon,
  ...props
}) => {
  return (
    <div
      className={classNames(
        "w-full h-40 flex flex-col justify-between rounded-lg bg-background-900 p-4",
        className
      )}
      {...props}
    >
      <Icon className="w-8 h-8" />

      <div className="space-y-2">
        <p className="font-semibold text-2xl">{value}</p>
        <p className="text-gray-300 text-base">{title}</p>
      </div>
    </div>
  );
};

export default StatisticBox;
