import { TraceImageResult } from "@/hooks/useTraceImage";
import { parseTime } from "@/utils";
import { getTitle } from "@/utils/data";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";

interface TraceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TraceImageResult;
  isActive?: boolean;
}

const TraceCard: React.FC<TraceCardProps> = ({
  data,
  className,
  isActive,
  ...props
}) => {
  const { locale } = useRouter();
  const { t } = useTranslation("trace");

  return (
    <div
      className={classNames(
        "space-y-2 bg-background-900 p-4 hover:bg-white/20 transition duration-300 cursor-pointer",
        isActive && "bg-white/20",
        className
      )}
      {...props}
    >
      <p className="text-lg font-semibold">{getTitle(data.anime, locale)}</p>

      <div className="grid grid-cols-10">
        <div className="col-span-5 flex flex-col justify-between">
          <p>
            {t("common:episode")} {data.episode}
          </p>

          <p>
            {parseTime(data.from)} - {parseTime(data.to)}
          </p>

          {/* <p>~{(data.similarity * 100).toFixed(2)}% chính xác</p> */}
          <p>
            {t("percent_similarity", {
              percent: (data.similarity * 100).toFixed(2),
            })}
          </p>
        </div>
        <div className="col-span-5">
          <video
            src={`${data.video}&size=s`}
            loop
            className="w-full object-contain"
            autoPlay
            muted
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(TraceCard);
