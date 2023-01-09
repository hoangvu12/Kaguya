import { MediaFormat, MediaSort } from "@/types/anilist";
import AnimeBrowseList from "@/components/features/anime/AnimeBrowseList";
import CharacterBrowseList from "@/components/features/characters/CharacterBrowseList";
import MangaBrowseList from "@/components/features/manga/MangaBrowseList";
import VABrowseList from "@/components/features/va/VABrowseList";
import Head from "@/components/shared/Head";
import Select from "@/components/shared/Select";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import Section from "@/components/shared/Section";
import UserBrowseList from "@/components/features/users/UserBrowseList";

const components = {
  anime: AnimeBrowseList,
  manga: MangaBrowseList,
  characters: CharacterBrowseList,
  voice_actors: VABrowseList,
  users: UserBrowseList,
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
  const { t } = useTranslation();
  const { TYPES } = useConstantTranslation();

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
    genres: convertQueryToArray<string>(genres),
    tags: convertQueryToArray<string>(tags),
    countries: convertQueryToArray<string>(countries),
    season: season as string,
    seasonYear: seasonYear as string,
    sort: sort as MediaSort,
    type,
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
  const chosenType = useMemo(
    () => TYPES.find((t) => t.value === type),
    [TYPES, type]
  );

  return (
    <Section className="py-20">
      <Head
        title={`Search ${chosenType.label} - Kaguya`}
        description={`Search ${chosenType.label} in Kaguya`}
      />

      <div className="mb-8 flex items-center space-x-2">
        <h1 className="text-4xl font-semibold text-center md:text-left">
          {t("common:search")}
        </h1>

        <Select
          value={{ value: type, label: chosenType.label }}
          options={TYPES}
          isClearable={false}
          isSearchable={false}
          components={{ IndicatorSeparator: () => null }}
          onChange={handleTypeChange}
          styles={typeSelectStyles}
        />
      </div>

      <BrowseComponent defaultQuery={query} />
    </Section>
  );
};

BrowsePage.getInitialProps = ({ query }) => {
  return { query };
};

export default BrowsePage;
