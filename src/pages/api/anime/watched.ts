import supabase from "@/lib/supabaseAdmin";
import { Watched } from "@/types";
import { isFalsy } from "@/utils";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.json({ success: false });

    return;
  }

  try {
    const { media_id, episode_id, watched_time = 0 } = req.body;

    if (isFalsy(media_id) || isFalsy(episode_id)) {
      res.json({ success: false });

      return;
    }

    const { user, error: userError } = await supabase.auth.api.getUserByCookie(
      req
    );

    if (userError) {
      throw userError;
    }

    const { error: upsertError } = await supabase
      .from<Watched>("kaguya_watched")
      .upsert(
        {
          mediaId: media_id,
          episodeId: episode_id,
          userId: user.id,
          watchedTime: watched_time,
        },
        { returning: "minimal" }
      );

    if (upsertError) {
      throw upsertError;
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);

    res.json({ success: false, error: err.message });
  }
};

export default handler;
