import React, { useMemo } from "react";
import Image from "@/components/shared/Image";

import { Anime, Manga } from "@/types";
import { getTitle } from "@/utils/data";

interface PlainCardProps {
  data: Anime | Manga;
}

const PlainCard: React.FC<PlainCardProps> = ({ data }) => {
  const title = useMemo(() => getTitle(data), [data]);

  return (
    <div className="relative aspect-w-9 aspect-h-16">
      <Image
        src={data.cover_image.extra_large}
        layout="fill"
        objectFit="cover"
        alt={title}
      />
    </div>
  );
};

export default React.memo(PlainCard);
