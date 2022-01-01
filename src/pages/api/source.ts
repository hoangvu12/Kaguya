import config from "@/config";
import { parseBetween } from "@/utils";
import axios from "axios";
import { JSDOM } from "jsdom";
import type { NextApiRequest, NextApiResponse } from "next";

const sourceUrl =
  process.env.NODE_ENV === "development"
    ? config.getSourceUrl
    : `${config.proxyUrl}/?url=${encodeURIComponent(config.getSourceUrl)}`;

const getServers = async (episodeId: number) => {
  const { data }: any = await axios.post(
    sourceUrl,
    `episodeId=${episodeId}&backup=1`,
    { validateStatus: () => true, maxRedirects: 0 }
  );

  const dom = new JSDOM(data.html);

  const servers: { id: number; hash: string; name: string }[] = [];

  dom.window.document.querySelectorAll("a").forEach((el) => {
    if (el.dataset.play !== "api") return;

    const id = Number(el.dataset.id);
    const hash = el.dataset.href;
    const name = el.textContent.trim();

    servers.push({ id, hash, name });
  });

  return servers;
};

const getVideoUrl = async (id: number, hash: string) => {
  const { data }: any = await axios.post(sourceUrl, `link=${hash}&id=${id}`, {
    validateStatus: () => true,
    maxRedirects: 0,
  });

  return data.link;
};

const getSource = async (episodeId) => {
  const priorityServers = ["AKR", "FB", "DU"];

  const servers = await getServers(episodeId);

  const nameOfBestServer = priorityServers.find((server) => {
    return servers.some((s) => s.name === server);
  });

  const bestServer = servers.find((server) => server.name === nameOfBestServer);

  const sources = await getVideoUrl(bestServer.id, bestServer.hash);

  return sources;
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

    const sources = await getSource(episode_id);

    res.status(200).json({ success: true, sources });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Something went wrong",
      errorMessage: err.message,
    });
  }
};

export default handler;
