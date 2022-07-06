import useBreakpoint from "@/hooks/useBreakpoint";
import React from "react";
import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import Section from "../shared/Section";

interface ListSwiperSkeletonProps {
  hasTitle?: boolean;
}

const ListSwiperSkeleton: React.FC<ListSwiperSkeletonProps> = ({
  hasTitle = true,
}) => {
  const breakpoint = useBreakpoint();

  return (
    <Section>
      <Skeleton>
        {hasTitle && <SkeletonItem className="mb-4 h-8 w-52" />}

        <SkeletonItem
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2.5 md:gap-5"
          container
        >
          {[...new Array(breakpoint.items)].map((_, index) => (
            <SkeletonItem key={index} className="col-span-1 w-full" container>
              <CardSkeleton />
            </SkeletonItem>
          ))}
        </SkeletonItem>
      </Skeleton>
    </Section>
  );
};

export default ListSwiperSkeleton;
