import AnimeBrowseList from "@/components/features/anime/AnimeBrowseList";
import CharacterBrowseList from "@/components/features/characters/CharacterBrowseList";
import MangaBrowseList from "@/components/features/manga/MangaBrowseList";
import Head from "@/components/shared/Head";
import Select from "@/components/shared/Select";
import { TYPES } from "@/constants";
import { Anime, Format, Genre } from "@/types";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

const components = {
  anime: AnimeBrowseList,
  manga: MangaBrowseList,
  characters: CharacterBrowseList,
};

const convertQueryToArray = <T,>(query: T[]) => {
  if (typeof query === "string") return [query];

  return query;
};

const BrowsePage = ({ query: baseQuery }) => {
  const [type, setType] = useState(baseQuery.type);
  const router = useRouter();

  const {
    format = undefined,
    keyword = "",
    season = undefined,
    seasonYear = undefined,
    sort = "popularity",
    genres = [],
    tags = [],
    countries = [],
  } = baseQuery;

  const query = {
    format: format as Format,
    keyword: keyword as string,
    genres: convertQueryToArray<Genre>(genres),
    tags: convertQueryToArray<string>(tags),
    countries: convertQueryToArray<string>(countries),
    season: season as string,
    seasonYear: seasonYear as string,
    sort: sort as keyof Anime,
  };

  useEffect(() => {
    const truthyQuery = {};

    Object.keys(query).forEach((key) => {
      if (!query[key]) return;

      truthyQuery[key] = query[key];
    });

    router.replace({ query: { ...truthyQuery, type }, pathname: "/browse" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const BrowseComponent = useMemo(() => components[type], [type]);
  const chosenType = useMemo(() => TYPES.find((t) => t.value === type), [type]);

  return (
    <div className="py-20 px-4 md:px-12">
      <Head title={`Tìm kiếm ${chosenType.label} - Kaguya`} />

      <div className="mb-8 flex items-center space-x-2">
        <p className="text-4xl font-semibold text-center md:text-left">
          Tìm kiếm
        </p>

        <Select
          defaultValue={chosenType.value}
          options={TYPES}
          isClearable={false}
          components={{ IndicatorSeparator: () => null }}
          onChange={({ value }) => {
            setType(value);
          }}
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
