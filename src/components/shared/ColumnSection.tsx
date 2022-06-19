import { Media, MediaType } from "@/types/anilist";
import Link from "next/link";
import React from "react";
import { MdArrowForwardIos } from "react-icons/md";
import HorizontalCard from "./HorizontalCard";
import Skeleton, { SkeletonItem } from "./Skeleton";

interface ColumnSectionProps {
  data: Media[];
  title?: string;
  viewMoreHref?: string;
  type: MediaType;
  isLoading?: boolean;
}

const ColumnSection: React.FC<ColumnSectionProps> = ({
  data,
  title,
  viewMoreHref,
  type,
  isLoading,
}) => {
  return !isLoading ? (
    <div className="w-full grow-0 bg-background-800 pt-4">
      {title && (
        <h2 className="px-4 text-xl font-semibold mb-4 line-clamp-1">
          {title}
        </h2>
      )}

      <div className="space-y-2">
        {data.map((data) => (
          <HorizontalCard
            className="px-4 odd:bg-background-700"
            type={type}
            data={data}
            key={data.id}
          />
        ))}
      </div>

      {viewMoreHref && (
        <Link href={viewMoreHref}>
          <a className="w-full flex items-center justify-center p-5 space-x-2 hover:bg-white/10 transition duration-300">
            <p>Xem thêm</p>
            <MdArrowForwardIos className="w-4 h-4" />
          </a>
        </Link>
      )}
    </div>
  ) : (
    <ColumnSectionSkeleton />
  );
};

const ColumnSectionSkeleton = () => (
  <Skeleton className="flex-1">
    <SkeletonItem className="h-[400px]"></SkeletonItem>
  </Skeleton>
);

export default ColumnSection;
