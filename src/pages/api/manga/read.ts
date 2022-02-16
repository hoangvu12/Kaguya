import supabase from "@/lib/supabaseAdmin";
import { NextApiHandler } from "next";
import { isFalsy } from "@/utils";
import { Read } from "@/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.json({ success: false });

    return;
  }

  try {
    const { media_id, chapter_id } = req.body;

    if (isFalsy(media_id) || isFalsy(chapter_id)) {
      throw new Error("Missing required query params");
    }

    const { user, error: userError } = await supabase.auth.api.getUserByCookie(
      req
    );

    if (userError || !user) {
      throw userError;
    }

    const { error: upsertError } = await supabase
      .from<Read>("kaguya_read")
      .upsert(
        { mediaId: media_id, chapterId: chapter_id, userId: user.id },
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
