import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import config from "@/config";

const getProxyUrl = (url: string) => {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  let url = decodeURIComponent(req.query.url as string);

  const { range } = req.headers;

  const response = await axios.get<any, any, any>(url, {
    responseType: "stream",
    headers: {
      range,
      referer: url.includes(".mp4") ? config.getSourceUrl : "nettruyen",
    },
    maxRedirects: 0,
    validateStatus: () => true,
  });

  for (let header in response.headers) {
    if (header.toLowerCase() === "location") {
      res.redirect(getProxyUrl(response.headers[header]));

      return;
    }

    res.setHeader(header, response.headers[header]);
  }

  res.status(response.status);

  response.data.pipe(res);
};

export default proxy;
