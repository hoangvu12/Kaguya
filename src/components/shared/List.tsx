import { ArrayElement } from "@/utils/types";
import classNames from "classnames";
import React, { useMemo } from "react";

interface ListProps<T extends any[]>
  extends React.HTMLAttributes<HTMLDivElement> {
  data: T;
  children: (data: ArrayElement<T>) => React.ReactNode;
}

const defaultClassName =
  "sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

const List = <T extends any[]>({
  data,
  children,
  className = "",
  ...props
}: ListProps<T>) => {
  const validClassName = useMemo(
    () => (className.includes("grid-cols") ? className : defaultClassName),
    [className]
  );

  return (
    <div
      className={classNames(
        data.length ? "grid gap-4" : "text-center",
        validClassName
      )}
      {...props}
    >
      {data.length ? (
        data.map((item, index) => (
          <div className="col-span-1" key={index}>
            {children(item)}
          </div>
        ))
      ) : (
        <p className="text-2xl">Không có dữ liệu.</p>
      )}
    </div>
  );
};

export default React.memo(List) as typeof List;
