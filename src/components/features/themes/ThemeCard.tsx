import { AnimeThemeAPI } from "@/hooks/useThemeSearch";
import Link from "next/link";
import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

interface ThemeCardProps {
  anime: AnimeThemeAPI.Anime;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ anime }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer bg-background-800 w-full hover:bg-white/20 transition duration-300 px-3 py-2 space-y-1"
        onClick={() => setShow(!show)}
      >
        <div>
          <h1>{anime.name}</h1>

          <p className="text-gray-300 text-sm">
            {anime.season} {anime.year}
          </p>
        </div>

        <BiChevronDown className="w-6 h-6" />
      </div>

      {show &&
        anime.animethemes.map((theme) => (
          <Link
            href={{
              pathname: "/themes",
              query: { slug: anime.slug, type: theme.slug },
            }}
            replace
            key={theme.id}
          >
            <a>
              <p className="cursor-pointer bg-background-700 w-full hover:bg-white/20 transition duration-300 px-3 py-2 space-y-1">
                {theme.song.title} - {theme.type}
              </p>
            </a>
          </Link>
        ))}
    </div>
  );
};

export default ThemeCard;
