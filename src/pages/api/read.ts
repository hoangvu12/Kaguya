import supabase from "@/lib/supabaseAdmin";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.json({ success: false });

    return;
  }

  try {
    const { manga_id, chapter_id } = req.body;

    if (!manga_id || !chapter_id) {
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

    const { data: isRead, error: watchedError } = await supabase
      .from("read")
      .select("id")
      .eq("user_id", user.id)
      .eq("manga_id", manga_id);

    if (watchedError) {
      res.json({ success: false, error: watchedError.message });

      return;
    }

    if (isRead?.length) {
      const { error: updateError } = await supabase
        .from("read")
        .update({
          manga_id,
          chapter_id,
        })
        .match({ user_id: user.id, manga_id });

      if (updateError) {
        res.json({ success: false, error: updateError.message });

        return;
      }
    } else {
      const { error } = await supabase
        .from("read")
        .upsert(
          { user_id: user.id, manga_id, chapter_id },
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
