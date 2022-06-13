import {
  AiringSchedule,
  MediaArgs,
  PageArgs,
  AiringScheduleArgs,
  RecommendationArgs,
  StaffArgs,
  CharacterArgs,
  StudioArgs,
} from "@/types/anilist";
import { removeArrayOfObjectDup } from "@/utils";
import axios from "axios";
import {
  airingSchedulesQuery,
  charactersQuery,
  mediaDetailsQuery,
  MediaDetailsQueryResponse,
  mediaQuery,
  PageQueryResponse,
  recommendationsQuery,
  staffQuery,
  studioDetailsQuery,
  StudioDetailsQueryResponse,
} from "./queries";

const GRAPHQL_URL = "https://graphql.anilist.co";

export const anilistFetcher = async <T>(query: string, variables: any) => {
  type Response = {
    data: T;
  };

  const { data } = await axios.post<Response>(GRAPHQL_URL, {
    query,
    variables,
  });

  return data?.data;
};

export const getPageMedia = async (
  args: MediaArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args
  );

  return response?.Page;
};

export const getMedia = async (args: MediaArgs & PageArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args
  );

  return response?.Page.media;
};

export const getMediaDetails = async (
  args: MediaArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<MediaDetailsQueryResponse>(
    mediaDetailsQuery(fields),
    args
  );

  return response?.Media;
};

export const getAiringSchedules = async (
  args: AiringScheduleArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    airingSchedulesQuery(fields),
    args
  );

  return response?.Page.airingSchedules;
};

export const getRecommendations = async (
  args: RecommendationArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    recommendationsQuery(fields),
    args
  );

  return response?.Page.recommendations;
};

export const getAllAiringSchedules = async (
  args: PageArgs & AiringScheduleArgs,
  fields?: string
) => {
  let list: AiringSchedule[] = [];

  let page = 1;

  const fetch = async () => {
    const response = await anilistFetcher<PageQueryResponse>(
      airingSchedulesQuery(fields),
      { ...args, page }
    );

    list = list.concat(response?.Page.airingSchedules);

    if (response?.Page.pageInfo.hasNextPage) {
      page++;
      await fetch();
    }
  };

  await fetch();

  return removeArrayOfObjectDup(list, "mediaId");
};

export const getCharacters = async (
  args: PageArgs & CharacterArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    charactersQuery(fields),
    args
  );

  return response?.Page.characters;
};

export const getPageCharacters = async (
  args: PageArgs & CharacterArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    charactersQuery(fields),
    args
  );

  return response?.Page;
};

export const getStaff = async (args: PageArgs & StaffArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields),
    args
  );

  return response?.Page.staff;
};

export const getPageStaff = async (
  args: PageArgs & StaffArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields),
    args
  );

  return response?.Page;
};

export const getStudioDetails = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<StudioDetailsQueryResponse>(
    studioDetailsQuery(fields),
    args
  );

  return response?.Studio;
};
