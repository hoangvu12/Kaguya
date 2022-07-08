import config from "@/config";
import { Chapter, Episode } from "@/types";
import { serialize } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

export type FileInfo = {
  id?: string | number;
  size: number;
  name: string;
  converted: boolean;
  progress?: number;
  thumbnail?: string;
  error?: boolean;
};

export type VideoStatusResponse = {
  success: boolean;
  video: FileInfo;
};

export type Attachment = {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  content_type: string;
  ctx?: Record<string, any>;
};

export type UploadFileResponse = {
  success: boolean;
  files: Attachment[];
};

export type UploadVideoResponse = {
  success: boolean;
  videoId: string | number;
};

export type RemoteVideoUploadResponse = {
  success: boolean;
  remoteId: string | number;
};

export type RemoteStatus = {
  id?: string | number;
  progress?: number;
  fileId: string | number;
  downloaded: boolean;
  error: boolean;
};

export type RemoteStatusResponse = {
  success: boolean;
  remote: RemoteStatus;
};

export type UpsertEpisodeResponse = {
  success: boolean;
  episode: Episode;
};

export type UpsertChapterResponse = {
  success: boolean;
  chapter: Chapter;
};

export type UpsertEpisodeArgs = {
  sourceId: string;
  episode: {
    name: string;
    id: string;
  };
  mediaId: number;
};

export type UpsertChapterArgs = {
  sourceId: string;
  chapter: {
    name: string;
    id: string;
  };
  mediaId: number;
};

const client = axios.create({
  baseURL: config.nodeServerUrl,
});

client.interceptors.request.use((config) => {
  config.headers.authorization =
    "Bearer " + supabaseClient.auth.session()?.access_token;

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      new Error(error?.response?.data?.error || "Something went wrong")
    );
  }
);

export const createUploadService = (hostingId: string) => {
  const getVideoStatus = async (videoId: string | number) => {
    const { data } = await client.get<VideoStatusResponse>(
      `/upload/video/${hostingId}/${videoId}/status`
    );

    if (!data.success) throw new Error("Get video status failed");

    return data.video;
  };

  const uploadVideo = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const { data } = await client.post<UploadVideoResponse>(
      `/upload/video/${hostingId}`,
      formData
    );

    if (!data.success) throw new Error("Upload failed");

    const { videoId } = data;

    const videoInfo = await getVideoStatus(videoId);

    return videoInfo;
  };

  const getRemoteStatus = async (remoteId: string | number) => {
    const { data } = await client.get<RemoteStatusResponse>(
      `/upload/video/${hostingId}/remote/${remoteId}/status`
    );

    if (!data.success) throw new Error("Remote video status failed");

    return data.remote;
  };

  const remoteUploadVideo = async (url: string) => {
    const { data } = await client.post<RemoteVideoUploadResponse>(
      `/upload/video/${hostingId}/remote`,
      serialize({ file: url })
    );

    if (!data.success) throw new Error("Upload failed");

    return data.remoteId;
  };

  return {
    getVideoStatus,
    uploadVideo,
    getRemoteStatus,
    remoteUploadVideo,
  };
};

export const upsertEpisode = async (args: UpsertEpisodeArgs) => {
  const { sourceId, episode, mediaId } = args;
  const { data } = await client.post<UpsertEpisodeResponse>(
    `/upload/episodes/${mediaId}`,
    serialize({
      episodeName: episode.name,
      episodeId: episode.id,
      sourceId,
    })
  );

  if (!data.success) throw new Error("Upsert episode failed");

  return data.episode;
};

export const upsertChapter = async (args: UpsertChapterArgs) => {
  const { sourceId, chapter, mediaId } = args;
  const { data } = await client.post<UpsertChapterResponse>(
    `/upload/chapters/${mediaId}`,
    serialize({
      chapterName: chapter.name,
      chapterId: chapter.id,
      sourceId,
    })
  );

  if (!data.success) throw new Error("Upsert chapter failed");

  return data.chapter;
};

export const uploadFile = async (
  file: File | File[],
  ctx?: object | object[]
) => {
  const formData = new FormData();

  if (Array.isArray(file)) {
    file.forEach((f) => formData.append("file", f));
  } else {
    formData.append("file", file);
  }

  if (ctx) {
    formData.append("ctx", JSON.stringify(ctx));
  }

  const { data } = await client.post<UploadFileResponse>(
    "/upload/file",
    formData
  );

  if (!data.success) throw new Error("Upload failed");

  return data.files;
};
