import {
  COUNTRIES,
  FORMATS,
  GENRES,
  SEASONS,
  SEASON_YEARS,
  TYPES,
} from "@/constants";
import useBrowse, { UseBrowseOptions } from "@/hooks/useBrowseManga";
import TAGS from "@/tags.json";
import { convert } from "@/utils/data";
import { debounce } from "debounce";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";
import List from "@/components/shared/List";
import Head from "@/components/shared/Head";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import Select from "@/components/shared/Select";
import AnimeListSkeleton from "@/components/skeletons/AnimeListSkeleton";
import SortSelector from "./SortSelector";
import FormSelect from "./FormSelect";

const initialValues: UseBrowseOptions = {
  format: undefined,
  keyword: "",
  genres: [],
  tags: [],
  sort: "average_score",
  type: "manga",
  countries: [],
};

const genres = GENRES.map((genre) => ({
  value: genre.value,
  label: convert(genre.value, "genre"),
}));

const formats = FORMATS.map((format) => ({
  value: format,
  label: convert(format, "format"),
}));

const tags = TAGS.map((tag) => ({
  value: tag,
  label: tag,
}));

interface BrowseListProps {
  defaultQuery?: UseBrowseOptions;
  title?: string;
}

const BrowseList: React.FC<BrowseListProps> = ({
  defaultQuery = initialValues,
  title,
}) => {
  const defaultValues = { ...initialValues, ...defaultQuery };

  const {
    control,
    register,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<UseBrowseOptions>({
    defaultValues,
  });

  const router = useRouter();

  const query = watch();

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = useBrowse(query);

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue("keyword", e.target.value),
    500
  );

  const totalData = useMemo(
    () => data?.pages.map((el) => el.data).flat(),
    [data?.pages]
  );

  useEffect(() => {
    if (!isDirty) return;

    // Reset isDirty to false
    reset(query);

    const truthyQuery = {};

    Object.keys(query).forEach((key) => {
      if (!query[key]) return;

      truthyQuery[key] = query[key];
    });

    router.replace({ query: truthyQuery, pathname: "/browse" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return (
    <div className="min-h-screen px-4 md:px-12">
      <Head title={`${title} - Kaguya` || "Kaguya"} />

      {title && (
        <p className="mb-8 text-4xl font-semibold text-center md:text-left">
          {title}
        </p>
      )}

      <form className="space-y-4">
        <div className="flex items-center gap-4 overflow-x-auto lg:flex-wrap lg:justify-between lg:space-x-0 lg:overflow-x-visible snap-x lg:snap-none">
          <Input
            {...register("keyword")}
            containerInputClassName="border border-white/80"
            LeftIcon={AiOutlineSearch}
            onChange={handleInputChange}
            defaultValue={defaultValues.keyword}
            label="Tìm kiếm"
          />

          <FormSelect
            control={control}
            name="genres"
            defaultValue={defaultValues.genres}
            selectProps={{
              placeholder: "Thể loại",
              isMulti: true,
              options: genres,
            }}
            label="Thể loại"
          />

          <FormSelect
            control={control}
            name="format"
            defaultValue={defaultValues.format}
            selectProps={{
              placeholder: "Định dạng",
              options: formats,
            }}
            label="Định dạng"
          />

          <FormSelect
            control={control}
            name="tags"
            defaultValue={defaultValues.tags}
            selectProps={{
              placeholder: "Tags",
              isMulti: true,
              options: tags,
            }}
            label="Tags"
          />

          <FormSelect
            control={control}
            name="type"
            defaultValue={defaultValues.type}
            selectProps={{
              placeholder: "Loại tìm kiếm",
              options: TYPES,
              isClearable: false,
            }}
            label="Loại tìm kiếm"
          />

          <FormSelect
            control={control}
            name="countries"
            defaultValue={defaultValues.countries}
            selectProps={{
              placeholder: "Quốc gia",
              options: COUNTRIES,
              isMulti: true,
            }}
            label="Quốc gia"
          />
        </div>

        <div className="flex items-end justify-end">
          <Controller
            name="sort"
            control={control}
            defaultValue={defaultQuery.sort}
            render={({ field: { value, onChange } }) => (
              <SortSelector defaultValue={value} onChange={onChange} />
            )}
          />
        </div>
      </form>

      <div className="mt-8">
        {!isLoading && query ? (
          <React.Fragment>
            <List type="manga" data={totalData} />

            {isFetchingNextPage && !isError && (
              <div className="mt-4">
                <AnimeListSkeleton />
              </div>
            )}

            {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
              <InView onInView={handleFetch} />
            )}

            {!hasNextPage && !!totalData.length && (
              <p className="mt-8 text-2xl text-center">Hết rồi...</p>
            )}
          </React.Fragment>
        ) : (
          <AnimeListSkeleton />
        )}
      </div>
    </div>
  );
};

export default BrowseList;
