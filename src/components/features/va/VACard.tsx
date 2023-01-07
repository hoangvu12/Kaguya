import Image from "@/components/shared/Image";
import React from "react";
import Link from "@/components/shared/Link";
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
          <div className="relative aspect-w-2 aspect-h-3 space-y-2">
            <Image
              src={voiceActor.image.large}
              alt={voiceActor.name.userPreferred}
              width={193}
              height={290}
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
