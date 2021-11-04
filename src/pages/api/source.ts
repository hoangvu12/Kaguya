import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import supabase from "@/lib/supabase";
import { serialize } from "@/utils";
import config from "@/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id: episode_id },
  } = req;

  if (!config.getSourceUrl) {
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

  const {
    data: { source_id },
    error,
  } = await supabase
    .from("episodes")
    .select("source_id")
    .eq("episode_id", episode_id)
    .limit(1)
    .single();

  if (error) {
    res
      .status(400)
      .json({ success: false, error, errorMessage: "Something went wrong" });

    return;
  }

  const { data } = await axios.post<any>(
    config.getSourceUrl,
    serialize({
      ep: episode_id,
      id: source_id,
    })
  );

  const regex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  const url = data.match(regex)[0].replace("306084399", "167335343");

  res.status(200).json({ success: true, url });
};

export default handler;
