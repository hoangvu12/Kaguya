import supabase from "@/lib/supabaseAdmin";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.json({ success: false });

    return;
  }

  try {
    const { anime_id, episode_id } = req.body;

    if (!anime_id || !episode_id) {
      res.json({ success: false });

      return;
    }

    const { user, error: userError } = await supabase.auth.api.getUserByCookie(
      req
    );

    if (userError) {
      res.json({ success: false, error: userError.message });

      return;
    }

    const { data: isWatched, error: watchedError } = await supabase
      .from("watched")
      .select("id")
      .eq("user_id", user.id)
      .eq("anime_id", anime_id);

    if (watchedError) {
      res.json({ success: false, error: watchedError.message });

      return;
    }

    if (isWatched?.length) {
      const { error: updateError } = await supabase
        .from("watched")
        .update({
          anime_id,
          episode_id,
        })
        .match({ user_id: user.id, anime_id });

      if (updateError) {
        res.json({ success: false, error: updateError.message });

        return;
      }
    } else {
      const { error } = await supabase
        .from("watched")
        .upsert(
          { user_id: user.id, anime_id, episode_id },
          { ignoreDuplicates: false }
        );

      if (error) {
        res.json({ success: false, error: error.message });

        return;
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);

    res.json({ success: false, error: err.message });
  }
};

export default handler;
