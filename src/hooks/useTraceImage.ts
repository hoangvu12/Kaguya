import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import axios from "axios";
import { ImageType } from "react-images-uploading";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

interface RawTraceImageResult {
  filename: string;
  episode: number;
  from: number;
  anilist: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
}

interface RawTraceImageResponse {
  frameCount: number;
  error: string;
  result: RawTraceImageResult[];
}

export interface TraceImageResult {
  anime: Anime;
  filename: string;
  episode: number;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
}

export interface TraceImageResponse {
  frameCount: number;
  error: string;
  result: TraceImageResult[];
}

const apiUrl = "https://api.trace.moe/search?cutBorders";

const composeData = (
  traceData: RawTraceImageResponse,
  supabaseData: Anime[]
): TraceImageResponse => {
  const newResult = traceData.result
    .map((traceResult) => {
      const anime = supabaseData.find((a) => a.id === traceResult.anilist);

      if (!anime) return null;

      return {
        anime,
        filename: traceResult.filename,
        episode: traceResult.episode,
        from: traceResult.from,
        to: traceResult.to,
        similarity: traceResult.similarity,
        video: traceResult.video,
        image: traceResult.image,
      };
    })
    .filter((a) => a);

  return {
    frameCount: traceData.frameCount,
    error: traceData.error,
    result: newResult,
  };
};

export const useTraceImage = () => {
  return useMutation<TraceImageResponse, Error, ImageType, any>(
    async (image) => {
      let data: RawTraceImageResponse;

      if (image?.file) {
        const formData = new FormData();
        formData.append("image", image.file);

        const { data: responseData } = await axios.post<RawTraceImageResponse>(
          apiUrl,
          formData
        );

        data = responseData;
      } else {
        const { data: responseData } = await axios.get<RawTraceImageResponse>(
          `${apiUrl}&url=${encodeURIComponent(image.dataURL)}`
        );

        data = responseData;
      }

      if (data.error) throw new Error(data.error);

      const anilistIds = data.result.map((result) => result.anilist);

      const { data: supabaseData } = await supabase
        .from<Anime>("kaguya_anime")
        .select("*")
        .in("id", anilistIds);

      const newData = composeData(data, supabaseData);

      return newData;
    },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useTraceImage;
