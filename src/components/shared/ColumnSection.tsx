import { Media, MediaType } from "@/types/anilist";
import Link from "@/components/shared/Link";
import React from "react";
import { MdArrowForwardIos } from "react-icons/md";
import HorizontalCard from "./HorizontalCard";
import Skeleton, { SkeletonItem } from "./Skeleton";

interface ColumnSectionProps {
  data: Media[];
  title?: string;
  viewMoreHref?: string;
  isLoading?: boolean;
}

const ColumnSection: React.FC<ColumnSectionProps> = ({
  data,
  title,
  viewMoreHref,
  isLoading,
}) => {
  return !isLoading ? (
    <div className="flex-1 bg-background-800 pt-4">
      {title && (
        <h2 className="mb-4 px-4 text-xl font-semibold line-clamp-1">
          {title}
        </h2>
      )}

      <div className="space-y-2">
        {data.map((data) => (
          <HorizontalCard
            className="px-4 odd:bg-background-700"
            data={data}
            key={data.id}
          />
        ))}
      </div>

      {viewMoreHref && (
        <Link href={viewMoreHref}>
          <a className="flex w-full items-center justify-center space-x-2 p-5 transition duration-300 hover:bg-white/10">
            <p>Xem thêm</p>
            <MdArrowForwardIos className="h-4 w-4" />
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
    <SkeletonItem className="h-full min-h-[636px]"></SkeletonItem>
  </Skeleton>
);

export default ColumnSection;
