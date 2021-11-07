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

    const { error } = await supabase
      .from("watched")
      .upsert(
        { user_id: user.id, anime_id, episode_id },
        { onConflict: "anime_id" }
      );

    if (error) {
      console.log(error);

      res.json({ success: false, error: error.message });

      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);

    res.json({ success: false, error: err.message });
  }
};

export default handler;
