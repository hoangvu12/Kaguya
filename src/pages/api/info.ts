import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import config from "@/config";
import supabase from "@/lib/supabase";

const info = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, source_id, slug } = req.query;

  const { user, error: userError } = await supabase.auth.api.getUserByCookie(
    req
  );

  if (!user || userError) {
    return res.status(401).json({ success: false, error: userError.message });
  }

  const { data: syncUser, error: syncUserError } = await supabase
    .from("users")
    .select("auth_role")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (syncUserError) {
    return res
      .status(401)
      .json({ success: false, error: syncUserError.message });
  }

  if (syncUser.auth_role !== "admin") {
    return res
      .status(401)
      .json({ success: false, error: syncUserError.message });
  }

  const nodeServerUrl = config.nodeServerUrl;

  const response: any = await axios.get(`${nodeServerUrl}/fetch`, {
    responseType: "stream",
    params: {
      source_id,
      id,
      slug,
    },
  });

  response.data.pipe(res);
};

export default info;
