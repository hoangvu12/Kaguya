import { Anime } from "@/types";
import {
  SupabaseQueryFunction,
  useSupabaseQuery,
  UseSupabaseQueryOptions,
} from "@/utils/supabase";
import React from "react";
import { QueryKey } from "react-query";
import { SkeletonProps } from "../shared/Skeleton";

interface AnimeSectionProps {
  title: string;
}

const AnimeSection: React.FC<AnimeSectionProps> = (props) => {
  const { children, title } = props;

  return (
    <div className="px-4 md:px-12 space-y-4">
      <h1 className="uppercase text-2xl font-semibold">{title}</h1>

      {children}
    </div>
  );
};

export default AnimeSection;
