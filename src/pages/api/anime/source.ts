import config from "@/config";
import { REVALIDATE_TIME } from "@/constants";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { episode_id, source_id },
  } = req;

  try {
    if (!config.nodeServerUrl) {
      res.status(400).json({
        success: false,
        error: "No url",
        errorMessage: "Something went wrong",
      });

      return;
    }

    if (!episode_id) {
      res.status(400).json({
        success: false,
        error: "No id provided",
        errorMessage: "Something went wrong",
      });

      return;
    }

    const { data }: any = await axios.get(`${config.nodeServerUrl}/source`, {
      params: { episode_id, source_id },
    });

    res.setHeader(
      "Cache-Control",
      `public, s-maxage=3600, stale-while-revalidate=${REVALIDATE_TIME}`
    );

    res.status(200).json({ success: true, sources: data.sources });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Something went wrong",
      errorMessage: err.message,
    });
  }
};

export default handler;
