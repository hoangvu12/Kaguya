import Image from "@/components/shared/Image";
import { CharacterConnection } from "@/types";
import { convert } from "@/utils/data";
import Link from "next/link";
import React from "react";

interface CharacterCardProps<T> {
  characterConnection: CharacterConnection<T>;
  type: T;
}

const CharacterConnectionCard = <T extends "anime" | "manga">({
  characterConnection,
  type: T,
}: CharacterCardProps<T>) => {
  return (
    <Link href={`/characters/details/${characterConnection.character_id}`}>
      <a>
        <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-background-900 hover:bg-white/20 transtion duration-300">
          <div className="relative h-full w-16">
            <Image
              src={characterConnection.character.image.large}
              layout="fill"
              objectFit="cover"
              alt={`${characterConnection.character.name}`}
            />
          </div>

          <div className="py-2 flex flex-col justify-between">
            <p className="font-semibold">
              {characterConnection.character.name}
            </p>

            <p>{convert(characterConnection.role, "characterRole")}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default React.memo(
  CharacterConnectionCard
) as typeof CharacterConnectionCard;
