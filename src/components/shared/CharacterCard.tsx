import { Character } from "@/types";
import React from "react";
import Image from "@/components/shared/Image";
import { convert } from "@/utils/data";

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-background-900">
      <div className="relative h-full w-16">
        <Image
          src={character.image.large}
          layout="fill"
          objectFit="cover"
          alt={`${character.name}`}
        />
      </div>

      <div className="py-2 flex flex-col justify-between">
        <p className="font-semibold">{character.name}</p>

        <p>{convert(character.role, "characterRole")}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
