import { Character } from "@/types";
import React from "react";
import Image from "@/components/shared/Image";

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-background-900">
      <div className="relative h-full w-16">
        <Image src={character.image.large} layout="fill" objectFit="cover" />
      </div>

      <div className="py-2 flex flex-col justify-between">
        <p>{character.name}</p>

        <p>{character.role}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
