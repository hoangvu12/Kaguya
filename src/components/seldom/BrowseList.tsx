import { FORMATS, GENRES, SEASONS, SEASON_YEARS } from "@/constants";
import useBrowse, { UseBrowseOptions } from "@/hooks/useBrowse";
import { convert } from "@/utils/anime";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";
import AnimeList from "../shared/AnimeList";
import Button from "../shared/Button";
import Input from "../shared/Input";
import Select from "../shared/Select";
import AnimeListSkeleton from "../skeletons/AnimeListSkeleton";
import SortSelector from "./SortSelector";

const BrowseList = () => {
  const { control, register, handleSubmit } = useForm<UseBrowseOptions>();
  const [query, setQuery] = useState<UseBrowseOptions>({
    format: "",
    keyword: "",
    genre: "",
    season: "",
    seasonYear: "",
    sort: "popularity",
  });
  const { data, isLoading } = useBrowse(query);
  const onSubmit = (data: UseBrowseOptions) => setQuery(data);

  return (
    <div className="min-h-screen px-4 md:px-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col md:flex-row space-y-2 items-center md:justify-between md:space-y-0">
          <Input
            {...register("keyword")}
            LeftIcon={AiOutlineSearch}
            label="Tìm kiếm"
          />

          <Controller
            name="genre"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                label="Thể loại"
                data={GENRES.map((genre) => ({
                  value: genre as string,
                  placeholder: convert(genre, "genre"),
                }))}
                onChange={({ value }) => field.onChange(value)}
              />
            )}
          />

          <Controller
            name="seasonYear"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                label="Năm"
                data={SEASON_YEARS.map((year) => ({
                  value: year.toString(),
                  placeholder: year.toString(),
                }))}
                onChange={({ value }) => field.onChange(value)}
              />
            )}
          />

          <Controller
            name="season"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                label="Mùa"
                data={SEASONS.map((season) => ({
                  value: season,
                  placeholder: convert(season, "season"),
                }))}
                onChange={({ value }) => field.onChange(value)}
              />
            )}
          />

          <Controller
            name="format"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                label="Định dạng"
                data={FORMATS.map((format) => ({
                  value: format,
                  placeholder: convert(format, "format"),
                }))}
                onChange={({ value }) => field.onChange(value)}
              />
            )}
          />
        </div>

        <div className="flex items-center space-x-4 justify-end">
          <Controller
            name="sort"
            control={control}
            defaultValue="popularity"
            render={({ field }) => <SortSelector onChange={field.onChange} />}
          />

          <Button primary outline type="submit">
            Tìm kiếm
          </Button>
        </div>
      </form>

      <div className="mt-8">
        {!isLoading && query ? (
          <AnimeList data={data} />
        ) : (
          <AnimeListSkeleton />
        )}
      </div>
    </div>
  );
};

export default BrowseList;
