import Image from "@/components/shared/Image";
import React from "react";
import Link from "next/link";
import { Staff } from "@/types/anilist";
import { createVoiceActorDetailsUrl } from "@/utils";

interface VACardProps {
  voiceActor: Staff;
}

const VACard: React.FC<VACardProps> = ({ voiceActor }) => {
  return (
    <Link href={createVoiceActorDetailsUrl(voiceActor)}>
      <a>
        <div className="space-y-2">
          <div className="aspect-w-9 aspect-h-16 space-y-2">
            <Image
              src={voiceActor.image.large}
              alt={voiceActor.name.userPreferred}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <p>{voiceActor.name.userPreferred}</p>
        </div>
      </a>
    </Link>
  );
};

export default React.memo(VACard);
