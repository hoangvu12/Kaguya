import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import config from "@/config";
import supabase from "@/lib/supabase";

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { type } = req.query;

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

  const response: any = await axios.post(
    `${config.nodeServerUrl}/create?type=${type}`,
    req.body,
    { responseType: "stream" }
  );

  response.data.pipe(res);
};

export default create;
