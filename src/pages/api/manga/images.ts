import config from "@/config";
import { REVALIDATE_TIME } from "@/constants";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const images = async (req: NextApiRequest, res: NextApiResponse) => {
  const { source_media_id, chapter_id, source_id } = req.query;

  try {
    const { data } = await axios.get(
      `${config.nodeServerUrl}/images?source_media_id=${source_media_id}&source_id=${source_id}&chapter_id=${chapter_id}`
    );

    res.setHeader(
      "Cache-Control",
      `public, s-maxage=3600, stale-while-revalidate=${REVALIDATE_TIME}`
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      errorMessage: "Something went wrong",
    });
  }
};

export default images;
