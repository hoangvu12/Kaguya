import config from "@/config";
import { serialize } from "@/utils";
import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestUrl = `${config.nodeServerUrl}/proxy?${serialize(req.query)}`;

  const { host, ...headers } = req.headers;

  const response: any = await axios.get(requestUrl, {
    responseType: "stream",
    // @ts-ignore
    headers,
    validateStatus: () => true,
    maxRedirects: 0,
  });

  for (const header in response.headers) {
    if (header.toLowerCase() === "location") {
      const params = {
        ...req.query,
        url: response.headers[header],
      };

      res.redirect(302, `/api/proxy?${serialize(params)}`);

      return;
    }

    res.setHeader(header, response.headers[header]);
  }

  res.status(response.status);

  response.data.pipe(res);
};

export default proxy;
