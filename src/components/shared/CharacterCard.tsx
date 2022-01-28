import Image from "@/components/shared/Image";
import { CharacterConnection } from "@/types";
import { convert } from "@/utils/data";
import React from "react";

interface CharacterCardProps<T> {
  characterConnection: CharacterConnection<T>;
  type: T;
}

const CharacterCard = <T extends "anime" | "manga">({
  characterConnection,
  type: T,
}: CharacterCardProps<T>) => {
  return (
    <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-background-900">
      <div className="relative h-full w-16">
        <Image
          src={characterConnection.character.image.large}
          layout="fill"
          objectFit="cover"
          alt={`${characterConnection.character.name}`}
        />
      </div>

      <div className="py-2 flex flex-col justify-between">
        <p className="font-semibold">{characterConnection.character.name}</p>

        <p>{convert(characterConnection.role, "characterRole")}</p>
      </div>
    </div>
  );
};

export default React.memo(CharacterCard) as typeof CharacterCard;
