import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";

const images = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, chapter_id } = req.query;
  res.setHeader("Cache-Control", "s-maxage=86400");

  try {
    const { data } = await axios.get(
      `http://www.nettruyenpro.com/truyen-tranh/${slug}/chap-0/${chapter_id}`
    );

    const images = composeImages(data);

    res.status(200).json({ success: true, images });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        error: err.message,
        errorMessage: "Something went wrong",
      });
  }
};

const composeImages = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const images = [];

  document.querySelectorAll(".page-chapter img").forEach((el) => {
    const source = (el as HTMLImageElement).dataset.original;

    const protocols = ["http", "https"];

    const image = protocols.some((protocol) => source.includes(protocol))
      ? source
      : `https:${source}`;

    images.push(image);
  });

  return images;
};

export default images;
