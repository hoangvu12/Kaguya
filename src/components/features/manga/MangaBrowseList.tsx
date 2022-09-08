import AdvancedSettings from "@/components/shared/AdvancedSettings";
import Card from "@/components/shared/Card";
import FormSelect from "@/components/shared/FormSelect";
import GenresFormSelect from "@/components/shared/GenresFormSelect";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import SortSelector from "@/components/shared/SortSelector";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useBrowse, { UseBrowseOptions } from "@/hooks/useBrowseManga";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { MediaSort } from "@/types/anilist";
import { debounce } from "@/utils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";

const initialValues: UseBrowseOptions = {
  format: undefined,
  keyword: "",
  genres: [],
  tags: [],
  sort: MediaSort.Trending_desc,
  country: undefined,
};

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
  const { FORMATS, STATUS, COUNTRIES } = useConstantTranslation();
  const { t } = useTranslation("common");
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
    () => data?.pages.flatMap((el) => el.media),
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
            label={t("search")}
            containerClassName="md:hidden shrink-0"
          />

          <div className="snap-x overflow-x-auto flex items-center gap-6">
            <Input
              {...register("keyword")}
              containerInputClassName="border border-white/80"
              LeftIcon={AiOutlineSearch}
              onChange={handleInputChange}
              defaultValue={defaultValues.keyword}
              label={t("search")}
              containerClassName="hidden md:block shrink-0"
            />

            <GenresFormSelect
              value={[...query.genres, ...query.tags]}
              onChange={handleGenresChange}
            />

            <FormSelect
              control={control}
              name="format"
              defaultValue={defaultValues.format}
              selectProps={{
                placeholder: t("format"),
                options: FORMATS,
              }}
              label={t("format")}
            />

            <FormSelect
              control={control}
              name="status"
              defaultValue={defaultValues.status}
              selectProps={{
                placeholder: t("status"),
                options: STATUS,
              }}
              label={t("status")}
            />

            <FormSelect
              control={control}
              name="country"
              defaultValue={defaultValues.country}
              selectProps={{
                placeholder: t("country"),
                options: COUNTRIES,
              }}
              label={t("country")}
            />
          </div>

          <AdvancedSettings
            referenceClassName="hidden md:flex"
            className="space-y-4"
          >
            <div className="flex items-center">
              <input
                className="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-gray-600 checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mr-2 cursor-pointer"
                type="checkbox"
                id="adultCheckbox"
                {...register("isAdult")}
              />
              <label
                className="inline-block text-white"
                htmlFor="adultCheckbox"
              >
                18+
              </label>
            </div>
          </AdvancedSettings>
        </div>

        <div className="flex items-end justify-end">
          <Controller
            name="sort"
            control={control}
            defaultValue={defaultQuery.sort}
            render={({ field: { value, onChange } }) => (
              <SortSelector
                type="manga"
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
            <List data={totalData}>{(item) => <Card data={item} />}</List>

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
