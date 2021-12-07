import supabase from "@/lib/supabaseAdmin";
import { Reaction } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

const react = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(400).json({ success: false });

    return;
  }

  try {
    const { emoji, comment_id, type } = req.body;

    if (!comment_id || !type) {
      res.json({ success: false });

      return;
    }

    const { user, error: userError } = await supabase.auth.api.getUserByCookie(
      req
    );

    if (userError) {
      res.status(400).json({ success: false, error: userError.message });

      return;
    }

    if (type === "UNREACT") {
      const { error: removeError } = await supabase
        .from<Reaction>("comment_reactions")
        .delete()
        .match({
          comment_id,
          user_id: user.id,
        });

      if (removeError) {
        res.status(400).json({ success: false, error: removeError.message });

        return;
      }

      return res.json({ success: true });
    }

    if (type !== "REACT") {
      return res.status(400).json({ success: false });
    }

    if (!emoji) {
      return res.status(400).json({ success: false });
    }

    const { error: addReactError } = await supabase
      .from<Reaction>("comment_reactions")
      .insert({ emoji, comment_id, user_id: user.id });

    if (addReactError) {
      res.status(400).json({ success: false, error: addReactError.message });

      return;
    }

    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default react;
