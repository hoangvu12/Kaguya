import Image from "@/components/shared/Image";
import Loading from "@/components/shared/Loading";
import useReaction from "@/hooks/useReaction";
import clsx from "clsx";
import React from "react";

export interface ReactionProps {
  type: string;
  className?: string;
}

const Reaction: React.FC<ReactionProps> = ({ type, className = "" }) => {
  const { data, isLoading } = useReaction(type);

  return (
    <div
      className={clsx(
        "relative h-6 w-6 rounded-full grid place-items-center text-white",
        className
      )}
    >
      {isLoading ? (
        <Loading className="w-6 h-6" />
      ) : (
        <Image
          unoptimized
          className={"h-6 w-6"}
          src={data.url || ""}
          alt={data.label}
          layout="fill"
        />
      )}
    </div>
  );
};

export default Reaction;
