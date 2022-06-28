import config from "@/config";
import { Episode } from "@/types";
import { serialize } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

enum VideoFileStatus {
  Onqueue = "onqueue",
  Processing = "processing",
  Converted = "converted",
  Failed = "failed",
  Transferring = "transferring",
  Converting = "converting",
}

export type FileInfo = {
  hashid: string;
  name: string;
  size: number;
  views: number;
  poster: string;
  status: string;
  created_at: Date;
};

export type VideoStatusResponse = {
  success: boolean;
  video: FileInfo;
};

export type VideoFileResponse = {
  hashid: string;
  folder?: any;
  name: string;
  ext: string;
  mimeType: string;
  size: number;
  status: VideoFileStatus;
  uploaded_at: Date;
};

export type Attachment = {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  content_type: string;
  ctx?: object;
};

export type UploadFileResponse = {
  success: boolean;
  files: Attachment[];
};

export type UploadVideoResponse = {
  success: boolean;
  video: VideoFileResponse;
};

export type RemoteVideoUploadResponse = {
  success: boolean;
  remote: {
    id: number;
    url: string;
    name: string;
  };
};

export type RemoteStatus = {
  id: number;
  url: string;
  name: string;
  data: {
    fileId: string;
    percentage: number;
    size: number;
  };
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type RemoteStatusResponse = {
  success: boolean;
  remote: RemoteStatus;
};

export type UpsertEpisodeResponse = {
  success: boolean;
  episode: Episode;
};

export type UpsertEpisodeArgs = {
  sourceId: string;
  episode: {
    name: string;
    id: string;
  };
  mediaId: number;
};

const client = axios.create({
  // baseURL: config.nodeServerUrl,
  baseURL: "http://localhost:3001/kaguya",
});

client.interceptors.request.use((config) => {
  config.headers.authorization =
    "Bearer " + supabaseClient.auth.session()?.access_token;

  return config;
});

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

export const getVideoStatus = async (hashid: string) => {
  const { data } = await client.get<VideoStatusResponse>(
    `/upload/video/${hashid}/status`
  );

  if (!data.success) throw new Error("Get video status failed");

  return data.video;
};

export const uploadVideo = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await client.post<UploadVideoResponse>(
    "/upload/video",
    formData
  );

  if (!data.success) throw new Error("Upload failed");

  return data.video;
};

export const getRemoteStatus = async (remoteId: number) => {
  const { data } = await client.get<RemoteStatusResponse>(
    `/upload/video/remote/${remoteId}/status`
  );

  if (!data.success) throw new Error("Remote video status failed");

  return data.remote;
};

export const remoteUploadVideo = async (url: string) => {
  const { data } = await client.post<RemoteVideoUploadResponse>(
    "/upload/video/remote",
    serialize({ file: url })
  );

  if (!data.success) throw new Error("Upload failed");

  return data.remote;
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
