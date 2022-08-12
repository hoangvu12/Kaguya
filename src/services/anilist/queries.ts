import { Media, Page, Studio } from "@/types/anilist";

export type PageQueryResponse = {
  Page: Page;
};

export type MediaDetailsQueryResponse = {
  Media: Media;
};

export type StudioDetailsQueryResponse = {
  Studio: Studio;
};

export const mediaDefaultFields = `
id
type
title {
  userPreferred
}
coverImage {
  extraLarge
  large
  color
}
startDate {
  year
  month
  day
}
endDate {
  year
  month
  day
}
bannerImage
season
seasonYear
description
type
format
status(version: 2)
episodes
duration
chapters
volumes
favourites
trending
genres
isAdult
averageScore
popularity
trailer {
  id
  site 
}
`;

export const mediaQuery = (fields: string = mediaDefaultFields) => `
query Media(
  $page: Int = 1,
  $perPage: Int = 20,
  $id: Int
  $idMal: Int
  $startDate: FuzzyDateInt
  $endDate: FuzzyDateInt
  $season: MediaSeason
  $seasonYear: Int
  $type: MediaType
  $format: MediaFormat
  $status: MediaStatus
  $episodes: Int
  $duration: Int
  $chapters: Int
  $volumes: Int
  $isAdult: Boolean
  $genre: String
  $tag: String
  $minimumTagRank: Int
  $tagCategory: String
  $onList: Boolean
  $licensedBy: String
  $licensedById: Int
  $averageScore: Int
  $popularity: Int
  $source: MediaSource
  $countryOfOrigin: CountryCode
  $isLicensed: Boolean
  $search: String
  $id_not: Int
  $id_in: [Int]
  $id_not_in: [Int]
  $idMal_not: Int
  $idMal_in: [Int]
  $idMal_not_in: [Int]
  $startDate_greater: FuzzyDateInt
  $startDate_lesser: FuzzyDateInt
  $startDate_like: String
  $endDate_greater: FuzzyDateInt
  $endDate_lesser: FuzzyDateInt
  $endDate_like: String
  $format_in: [MediaFormat]
  $format_not: MediaFormat
  $format_not_in: [MediaFormat]
  $status_in: [MediaStatus]
  $status_not: MediaStatus
  $status_not_in: [MediaStatus]
  $episodes_greater: Int
  $episodes_lesser: Int
  $duration_greater: Int
  $duration_lesser: Int
  $chapters_greater: Int
  $chapters_lesser: Int
  $volumes_greater: Int
  $volumes_lesser: Int
  $genre_in: [String]
  $genre_not_in: [String]
  $tag_in: [String]
  $tag_not_in: [String]
  $tagCategory_in: [String]
  $tagCategory_not_in: [String]
  $licensedBy_in: [String]
  $licensedById_in: [Int]
  $averageScore_not: Int
  $averageScore_greater: Int
  $averageScore_lesser: Int
  $popularity_not: Int
  $popularity_greater: Int
  $popularity_lesser: Int
  $source_in: [MediaSource]
  $sort: [MediaSort]
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(
      id: $id
      idMal: $idMal
      startDate: $startDate
      endDate: $endDate
      season: $season
      seasonYear: $seasonYear
      type: $type
      format: $format
      status: $status
      episodes: $episodes
      duration: $duration
      chapters: $chapters
      volumes: $volumes
      isAdult: $isAdult
      genre: $genre
      tag: $tag
      minimumTagRank: $minimumTagRank
      tagCategory: $tagCategory
      onList: $onList
      licensedBy: $licensedBy
      licensedById: $licensedById
      averageScore: $averageScore
      popularity: $popularity
      source: $source
      countryOfOrigin: $countryOfOrigin
      isLicensed: $isLicensed
      search: $search
      id_not: $id_not
      id_in: $id_in
      id_not_in: $id_not_in
      idMal_not: $idMal_not
      idMal_in: $idMal_in
      idMal_not_in: $idMal_not_in
      startDate_greater: $startDate_greater
      startDate_lesser: $startDate_lesser
      startDate_like: $startDate_like
      endDate_greater: $endDate_greater
      endDate_lesser: $endDate_lesser
      endDate_like: $endDate_like
      format_in: $format_in
      format_not: $format_not
      format_not_in: $format_not_in
      status_in: $status_in
      status_not: $status_not
      status_not_in: $status_not_in
      episodes_greater: $episodes_greater
      episodes_lesser: $episodes_lesser
      duration_greater: $duration_greater
      duration_lesser: $duration_lesser
      chapters_greater: $chapters_greater
      chapters_lesser: $chapters_lesser
      volumes_greater: $volumes_greater
      volumes_lesser: $volumes_lesser
      genre_in: $genre_in
      genre_not_in: $genre_not_in
      tag_in: $tag_in
      tag_not_in: $tag_not_in
      tagCategory_in: $tagCategory_in
      tagCategory_not_in: $tagCategory_not_in
      licensedBy_in: $licensedBy_in
      licensedById_in: $licensedById_in
      averageScore_not: $averageScore_not
      averageScore_greater: $averageScore_greater
      averageScore_lesser: $averageScore_lesser
      popularity_not: $popularity_not
      popularity_greater: $popularity_greater
      popularity_lesser: $popularity_lesser
      source_in: $source_in
      sort: $sort      
    ) {
      ${fields}
    }
  }
}

`;

export const mediaDetailsDefaultFields = `
id
idMal
title {
  romaji
  english
  native
  userPreferred
}
type
format
status
description
startDate {
  year
  month
  day
}
endDate {
  year
  month
  day
}
season
seasonYear
seasonInt
episodes
duration
chapters
volumes
countryOfOrigin
updatedAt
coverImage {
  extraLarge
  large
  medium
  color
}
bannerImage
genres
synonyms
averageScore
popularity
trending
favourites
tags {
  id
  name
  description
  category
  rank
  isGeneralSpoiler
  isMediaSpoiler
  isAdult
  userId
}
relations {
  nodes {
    ${mediaDefaultFields}
  }
  pageInfo {
    total
    perPage
    currentPage
    lastPage
    hasNextPage
  }
}
characters {
  edges {
    role
    node {
      id
      image {
        large
        medium
      }
      name {
        first
        middle
        last
        full
        native
        userPreferred
      }
    }
  }
  pageInfo {
    total
    perPage
    currentPage
    lastPage
    hasNextPage
  }
}
studios {
  nodes {
    id
    name
  }
  pageInfo {
    total
    perPage
    currentPage
    lastPage
    hasNextPage
  }
}
isAdult
recommendations {
  nodes {
    mediaRecommendation {
      ${mediaDefaultFields}
    }
  }
  pageInfo {
    total
    perPage
    currentPage
    lastPage
    hasNextPage
  }
}
airingSchedule(notYetAired: true, perPage: 1) {
  nodes {
    airingAt
    episode
  }
}
`;

export const mediaDetailsQuery = (
  fields: string = mediaDetailsDefaultFields
) => `
query Media(
  $id: Int
  $idMal: Int
  $startDate: FuzzyDateInt
  $endDate: FuzzyDateInt
  $season: MediaSeason
  $seasonYear: Int
  $type: MediaType
  $format: MediaFormat
  $status: MediaStatus
  $episodes: Int
  $duration: Int
  $chapters: Int
  $volumes: Int
  $isAdult: Boolean
  $genre: String
  $tag: String
  $minimumTagRank: Int
  $tagCategory: String
  $onList: Boolean
  $licensedBy: String
  $licensedById: Int
  $averageScore: Int
  $popularity: Int
  $source: MediaSource
  $countryOfOrigin: CountryCode
  $isLicensed: Boolean
  $search: String
  $id_not: Int
  $id_in: [Int]
  $id_not_in: [Int]
  $idMal_not: Int
  $idMal_in: [Int]
  $idMal_not_in: [Int]
  $startDate_greater: FuzzyDateInt
  $startDate_lesser: FuzzyDateInt
  $startDate_like: String
  $endDate_greater: FuzzyDateInt
  $endDate_lesser: FuzzyDateInt
  $endDate_like: String
  $format_in: [MediaFormat]
  $format_not: MediaFormat
  $format_not_in: [MediaFormat]
  $status_in: [MediaStatus]
  $status_not: MediaStatus
  $status_not_in: [MediaStatus]
  $episodes_greater: Int
  $episodes_lesser: Int
  $duration_greater: Int
  $duration_lesser: Int
  $chapters_greater: Int
  $chapters_lesser: Int
  $volumes_greater: Int
  $volumes_lesser: Int
  $genre_in: [String]
  $genre_not_in: [String]
  $tag_in: [String]
  $tag_not_in: [String]
  $tagCategory_in: [String]
  $tagCategory_not_in: [String]
  $licensedBy_in: [String]
  $licensedById_in: [Int]
  $averageScore_not: Int
  $averageScore_greater: Int
  $averageScore_lesser: Int
  $popularity_not: Int
  $popularity_greater: Int
  $popularity_lesser: Int
  $source_in: [MediaSource]
  $sort: [MediaSort]
) {
  Media(
    id: $id
    idMal: $idMal
    startDate: $startDate
    endDate: $endDate
    season: $season
    seasonYear: $seasonYear
    type: $type
    format: $format
    status: $status
    episodes: $episodes
    duration: $duration
    chapters: $chapters
    volumes: $volumes
    isAdult: $isAdult
    genre: $genre
    tag: $tag
    minimumTagRank: $minimumTagRank
    tagCategory: $tagCategory
    onList: $onList
    licensedBy: $licensedBy
    licensedById: $licensedById
    averageScore: $averageScore
    popularity: $popularity
    source: $source
    countryOfOrigin: $countryOfOrigin
    isLicensed: $isLicensed
    search: $search
    id_not: $id_not
    id_in: $id_in
    id_not_in: $id_not_in
    idMal_not: $idMal_not
    idMal_in: $idMal_in
    idMal_not_in: $idMal_not_in
    startDate_greater: $startDate_greater
    startDate_lesser: $startDate_lesser
    startDate_like: $startDate_like
    endDate_greater: $endDate_greater
    endDate_lesser: $endDate_lesser
    endDate_like: $endDate_like
    format_in: $format_in
    format_not: $format_not
    format_not_in: $format_not_in
    status_in: $status_in
    status_not: $status_not
    status_not_in: $status_not_in
    episodes_greater: $episodes_greater
    episodes_lesser: $episodes_lesser
    duration_greater: $duration_greater
    duration_lesser: $duration_lesser
    chapters_greater: $chapters_greater
    chapters_lesser: $chapters_lesser
    volumes_greater: $volumes_greater
    volumes_lesser: $volumes_lesser
    genre_in: $genre_in
    genre_not_in: $genre_not_in
    tag_in: $tag_in
    tag_not_in: $tag_not_in
    tagCategory_in: $tagCategory_in
    tagCategory_not_in: $tagCategory_not_in
    licensedBy_in: $licensedBy_in
    licensedById_in: $licensedById_in
    averageScore_not: $averageScore_not
    averageScore_greater: $averageScore_greater
    averageScore_lesser: $averageScore_lesser
    popularity_not: $popularity_not
    popularity_greater: $popularity_greater
    popularity_lesser: $popularity_lesser
    source_in: $source_in
    sort: $sort      
  ) {
    ${fields}
  }
}

`;

export const airingSchedulesDefaultFields = `
airingAt
episode
mediaId
media {
  bannerImage
  type
  id
  title {
    userPreferred
  }
  coverImage {
    extraLarge
    large
    color
  }
  genres
  favourites
  averageScore
}
`;

export const airingSchedulesQuery = (
  fields: string = airingSchedulesDefaultFields
) => `
query AiringSchedule($page: Int = 1, $perPage: Int = 20, $id: Int, $mediaId: Int, $episode: Int, $airingAt: Int, $notYetAired: Boolean, $id_not: Int, $id_in: [Int], $id_not_in: [Int], $mediaId_not: Int, $mediaId_in: [Int], $mediaId_not_in: [Int], $episode_not: Int, $episode_in: [Int], $episode_not_in: [Int], $episode_greater: Int, $episode_lesser: Int, $airingAt_greater: Int, $airingAt_lesser: Int, $sort: [AiringSort]) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    airingSchedules(
      id: $id, mediaId: $mediaId, episode: $episode, airingAt: $airingAt, notYetAired: $notYetAired, id_not: $id_not, id_in: $id_in, id_not_in: $id_not_in, mediaId_not: $mediaId_not, mediaId_in: $mediaId_in, mediaId_not_in: $mediaId_not_in, episode_not: $episode_not, episode_in: $episode_in, episode_not_in: $episode_not_in, episode_greater: $episode_greater, episode_lesser: $episode_lesser, airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser, sort: $sort
    ) {
      ${fields}
    }
  }
}
`;

export const recommendationsDefaultFields = `
id
rating
userRating
media {
  ${mediaDefaultFields}
}
mediaRecommendation {
  ${mediaDefaultFields}
}
`;

export const recommendationsQuery = (
  fields: string = recommendationsDefaultFields
) => `
query Recommendation ($page:Int = 1, $perPage: Int = 20, $id: Int,$mediaId: Int,$mediaRecommendationId: Int,$userId: Int,$rating: Int,$onList: Boolean,$rating_greater: Int,$rating_lesser: Int,$sort: [RecommendationSort]) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    recommendations(
      id: $id,mediaId: $mediaId,mediaRecommendationId: $mediaRecommendationId,userId: $userId,rating: $rating,onList: $onList,rating_greater: $rating_greater,rating_lesser: $rating_lesser,sort: $sort
    ) {
      ${fields}
    }
  }
}
`;

export const charactersDefaultFields = `
id
name {
  first
  middle
  last
  full
  native
  alternative
  alternativeSpoiler
  userPreferred
}
image {
  large
  medium
}
description
gender
dateOfBirth {
  year
  month
  day
}
age
bloodType
updatedAt
favourites
`;

export const charactersQuery = (fields = charactersDefaultFields) => `
query Character(
  $page: Int = 1
  $perPage: Int = 20
  $id: Int
  $isBirthday: Boolean
  $search: String
  $id_not: Int
  $id_in: [Int]
  $id_not_in: [Int]
  $sort: [CharacterSort]
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    characters(
      id: $id
      isBirthday: $isBirthday
      search: $search
      id_not: $id_not
      id_in: $id_in
      id_not_in: $id_not_in
      sort: $sort
    ) {
      ${fields}
    }
  }
}
`;

export const staffDefaultFields = `
id
name {
  first
  middle
  last
  full
  native
  alternative
  userPreferred
}
language
languageV2
image {
  large
  medium
}
description
primaryOccupations
gender
dateOfBirth {
  year
  month
  day
}
dateOfDeath {
  year
  month
  day
}
age
yearsActive
homeTown
bloodType
isFavourite
updatedAt
favourites
`;

export const staffQuery = (fields = staffDefaultFields) => `
query Staff(
  $page: Int = 1
  $perPage: Int = 20
  $id: Int
  $isBirthday: Boolean
  $search: String
  $id_not: Int
  $id_in: [Int]
  $id_not_in: [Int]
  $sort: [StaffSort]
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    staff(
      id: $id
      isBirthday: $isBirthday
      search: $search
      id_not: $id_not
      id_in: $id_in
      id_not_in: $id_not_in
      sort: $sort
    ) {
      ${fields}
    }
  }
}
`;

export const studioDetailsDefaultFields = `
id
name
isAnimationStudio
media(page: $page, perPage: $perPage, sort: ID_DESC) {
  nodes {
    ${mediaDefaultFields}
  }
  pageInfo {
    total
    perPage
    currentPage
    lastPage
    hasNextPage
  }
}
favourites
`;

export const studiosDefaultFields = `
id
name
isAnimationStudio
favourites
`;

export const studioDetailsQuery = (fields = studioDetailsDefaultFields) => `
query Studio(
  $page: Int = 1
  $perPage: Int = 20
  $id: Int
  $search: String
  $id_not: Int
  $id_in: [Int]
  $id_not_in: [Int]
  $sort: [StudioSort]
) {
  Studio(
    id: $id
    search: $search
    id_not: $id_not
    id_in: $id_in
    id_not_in: $id_not_in
    sort: $sort
  ) {
    ${fields}
  }
}
`;

export const studiosQuery = (fields = studiosDefaultFields) => `
query Studio(
  $page: Int = 1
  $perPage: Int = 20
  $id: Int
  $search: String
  $id_not: Int
  $id_in: [Int]
  $id_not_in: [Int]
  $sort: [StudioSort]
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    studios(
      id: $id
      search: $search
      id_not: $id_not
      id_in: $id_in
      id_not_in: $id_not_in
      sort: $sort
    ) {
      ${fields}
    }
  }
}
`;
