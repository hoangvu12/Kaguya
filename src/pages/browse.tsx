import AnimeBrowseList from "@/components/features/anime/AnimeBrowseList";
import CharacterBrowseList from "@/components/features/characters/CharacterBrowseList";
import VABrowseList from "@/components/features/va/VABrowseList";
import MangaBrowseList from "@/components/features/manga/MangaBrowseList";
import Head from "@/components/shared/Head";
import Select from "@/components/shared/Select";
import { TYPES } from "@/constants";
import useDevice from "@/hooks/useDevice";
import { Anime, MediaGenre } from "@/types";
import { MediaFormat } from "@/anilist";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

const components = {
  anime: AnimeBrowseList,
  manga: MangaBrowseList,
  characters: CharacterBrowseList,
  voice_actors: VABrowseList,
};

const convertQueryToArray = <T,>(query: T[]) => {
  if (typeof query === "string") return [query];

  return query;
};

const typeSelectStyles = {
  control: (provided) => {
    return {
      ...provided,
      backgroundColor: "#1a1a1a",
      border: 0,
      boxShadow: "none",
      padding: "0.25rem",
    };
  },
  singleValue: (provided) => {
    return {
      ...provided,
      fontSize: "2.25rem",
      lineHeight: "2.5rem",
      color: "white",
      fontWeight: 600,
    };
  },
  placeholder: (provided) => {
    return {
      ...provided,
      fontSize: "2.25rem",
      lineHeight: "2.5rem",
      color: "white",
      fontWeight: 600,
    };
  },
};

const BrowsePage = ({ query: baseQuery }) => {
  const router = useRouter();
  const { isMobile } = useDevice();

  const {
    format = undefined,
    keyword = "",
    season = undefined,
    seasonYear = undefined,
    sort = "popularity",
    genres = [],
    tags = [],
    countries = [],
    type = "anime",
  } = baseQuery;

  const query = {
    format: format as MediaFormat,
    keyword: keyword as string,
    genres: convertQueryToArray<MediaGenre>(genres),
    tags: convertQueryToArray<string>(tags),
    countries: convertQueryToArray<string>(countries),
    season: season as string,
    seasonYear: seasonYear as string,
    sort: sort as keyof Anime,
  };

  const handleTypeChange = (type: typeof TYPES[number]) => {
    const truthyQuery = {};

    Object.keys(query).forEach((key) => {
      if (!query[key]) return;

      truthyQuery[key] = query[key];
    });

    router.replace({
      query: { ...truthyQuery, type: type.value },
      pathname: "/browse",
    });
  };

  const BrowseComponent = useMemo(() => components[type], [type]);
  const chosenType = useMemo(() => TYPES.find((t) => t.value === type), [type]);

  return (
    <div className="py-20 px-4 md:px-12">
      <Head title={`Tìm kiếm ${chosenType.label} - Kaguya`} />

      <div className="mb-8 flex items-center space-x-2">
        <p className="text-4xl font-semibold text-center md:text-left">
          {isMobile ? "Tìm" : "Tìm kiếm"}
        </p>

        <Select
          defaultValue={chosenType}
          options={TYPES}
          isClearable={false}
          isSearchable={false}
          components={{ IndicatorSeparator: () => null }}
          onChange={handleTypeChange}
          styles={typeSelectStyles}
        />
      </div>

      <BrowseComponent defaultQuery={baseQuery} />
    </div>
  );
};

BrowsePage.getInitialProps = ({ query }) => {
  return { query };
};

export default BrowsePage;
