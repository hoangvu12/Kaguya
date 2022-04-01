import AdvancedSettings from "@/components/shared/AdvancedSettings";
import Card from "@/components/shared/Card";
import FormSelect from "@/components/shared/FormSelect";
import GenresFormSelect from "@/components/shared/GenresFormSelect";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import SortSelector from "@/components/shared/SortSelector";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { COUNTRIES, FORMATS, SEASONS, SEASON_YEARS, STATUS } from "@/constants";
import useBrowse, { UseBrowseOptions } from "@/hooks/useBrowseAnime";
import { debounce } from "@/utils";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo } from "react";
import { MobileView } from "react-device-detect";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";

const initialValues: UseBrowseOptions = {
  format: undefined,
  keyword: "",
  genres: [],
  season: undefined,
  seasonYear: undefined,
  tags: [],
  sort: "averageScore",
  countries: [],
};

const seasonYears = SEASON_YEARS.map((year) => ({
  value: year.toString(),
  label: year.toString(),
}));

const seasons = SEASONS.map((season) => ({
  value: season.value,
  label: season.label,
}));

const formats = FORMATS.map((format) => ({
  value: format.value,
  label: format.label,
}));

interface BrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const BrowseList: React.FC<BrowseListProps> = ({
  defaultQuery = initialValues,
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

  const handleGenresChange = useCallback(
    (values) => {
      values.forEach(({ type, value }) => {
        setValue(type === "TAGS" ? "tags" : "genres", value, {
          shouldDirty: true,
        });
      });
    },
    [setValue]
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
    <div className="min-h-screen">
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-6 lg:flex-wrap lg:justify-between lg:space-x-0">
          <Input
            {...register("keyword")}
            containerInputClassName="border border-white/80"
            LeftIcon={AiOutlineSearch}
            onChange={handleInputChange}
            defaultValue={defaultValues.keyword}
            label="Tìm kiếm"
            containerClassName="md:hidden shrink-0"
          />

          <div className="snap-x overflow-x-auto flex items-center gap-6">
            <Input
              {...register("keyword")}
              containerInputClassName="border border-white/80"
              LeftIcon={AiOutlineSearch}
              onChange={handleInputChange}
              defaultValue={defaultValues.keyword}
              label="Tìm kiếm"
              containerClassName="hidden md:block shrink-0"
            />

            <GenresFormSelect
              value={[...query.genres, ...query.tags]}
              onChange={handleGenresChange}
            />

            <FormSelect
              control={control}
              name="season"
              defaultValue={defaultValues.season}
              selectProps={{
                placeholder: "Mùa",
                options: seasons,
              }}
              label="Mùa"
            />

            <FormSelect
              control={control}
              name="seasonYear"
              defaultValue={defaultValues.seasonYear}
              selectProps={{
                placeholder: "Năm",
                options: seasonYears,
              }}
              label="Năm"
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

            <MobileView renderWithFragment>
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

              <FormSelect
                control={control}
                name="status"
                defaultValue={defaultValues.status}
                selectProps={{
                  placeholder: "Tình trạng",
                  options: STATUS,
                }}
                label="Tình trạng"
              />
            </MobileView>
          </div>

          <AdvancedSettings referenceClassName="hidden md:flex">
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

            <FormSelect
              control={control}
              name="status"
              defaultValue={defaultValues.status}
              selectProps={{
                placeholder: "Tình trạng",
                options: STATUS,
              }}
              label="Tình trạng"
            />
          </AdvancedSettings>
        </div>

        <div className="flex items-end justify-end">
          <Controller
            name="sort"
            control={control}
            defaultValue={defaultQuery.sort}
            render={({ field: { value, onChange } }) => (
              <SortSelector
                type="anime"
                defaultValue={value}
                onChange={onChange}
              />
            )}
          />
        </div>
      </form>

      <div className="mt-8">
        {!isLoading && query ? (
          <React.Fragment>
            <List data={totalData}>
              {(data) => <Card data={data} type="anime" />}
            </List>

            {isFetchingNextPage && !isError && (
              <div className="mt-4">
                <ListSkeleton />
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
          <ListSkeleton />
        )}
      </div>
    </div>
  );
};

export default BrowseList;
