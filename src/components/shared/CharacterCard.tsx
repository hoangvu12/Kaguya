import Image from "@/components/shared/Image";
import { Character } from "@/types/anilist";
import { createCharacterDetailsUrl } from "@/utils";
import Link from "next/link";
import React from "react";

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <Link href={createCharacterDetailsUrl(character)}>
      <a>
        <div className="space-y-2">
          <div className="aspect-w-9 aspect-h-16 space-y-2">
            <Image
              src={character.image.large}
              alt={character.name.userPreferred}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <p>{character.name.userPreferred}</p>
        </div>
      </a>
    </Link>
  );
};

export default React.memo(CharacterCard) as typeof CharacterCard;
