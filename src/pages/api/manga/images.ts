import config from "@/config";
import { REVALIDATE_TIME } from "@/constants";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const images = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!Object.keys(req.query).length) {
    res.status(400).json({
      success: false,
      error: "No id provided",
      errorMessage: "Something went wrong",
    });

    return;
  }

  try {
    const { data } = await axios.get(`${config.nodeServerUrl}/images`, {
      params: req.query,
    });

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
