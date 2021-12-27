import config from "@/config";
import { parseBetween } from "@/utils";
import axios from "axios";
import { JSDOM } from "jsdom";
import type { NextApiRequest, NextApiResponse } from "next";

type Sources = {
  source: {
    file: string;
    label: string;
    mimeType: string;
    preload: string;
    type: string;
  }[];

  source_fbo: {
    file: string;
  }[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id: episode_id },
  } = req;

  try {
    if (!config.getSourceUrl) {
      res.status(400).json({
        success: false,
        error: "No url",
        errorMessage: "Something went wrong",
      });

      return;
    }

    if (!episode_id) {
      res.status(400).json({
        success: false,
        error: "No id provided",
        errorMessage: "Something went wrong",
      });

      return;
    }

    const url = `${config.getSourceUrl}/xem-phim/s-${episode_id}.html`;

    const { data } = await axios.get<string>(
      `${config.proxyUrl}?url=${encodeURIComponent(url)}`
    );

    const dom = new JSDOM(data);

    const html = dom.window.document
      .querySelector(".watching-movie script")
      .innerHTML.replace(/\n/g, "")
      .replace(/\s+/g, "");

    const json = parseBetween(
      html.replace(/\\\//g, "/").replace(/\\"/g, '"'),
      "var$info_play_video=",
      "var$list_sv"
    )
      .replace('JSON.parse("', "")
      .replace('")', "")
      .replace("source", '"source"')
      .replace("source_fbo", '"source_fbo"')
      .replace("vast", '"vast"');

    const sources: Sources = JSON.parse(json);

    if (!sources) {
      res.status(400).json({
        success: false,
        error: "No sources",
        errorMessage: "Something went wrong",
      });

      return;
    }

    let sourceUrl: string;

    if (sources.source_fbo?.length) {
      sourceUrl = sources.source_fbo[0].file;
    } else {
      const sortedSources = sources.source.sort(
        (a, b) =>
          Number(b.label.replace("p", "")) - Number(a.label.replace("p", ""))
      );

      // sourceUrl = `${config.proxyUrl}?url=${encodeURIComponent(
      //   sortedSources[0].file
      // )}&headers[referer]=${config.getSourceUrl}`;
      sourceUrl = `/api/proxy?url=${encodeURIComponent(sortedSources[0].file)}`;
    }

    res.status(200).json({ success: true, url: sourceUrl });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Something went wrong",
      errorMessage: err.message,
    });
  }
};

export default handler;
