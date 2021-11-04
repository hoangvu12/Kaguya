import React from "react";
import NextHead from "next/head";
import { WEBSITE_URL } from "@/constants";

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
}

const Head: React.FC<HeadProps> = (props) => {
  const {
    title = "Kaguya",
    description = "Website xem anime hoàn toàn miễn phí, không quảng cáo.",
    image = "https://i.ibb.co/JnDDN9j/localhost-3000-2.png",
  } = props;

  return (
    <NextHead>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={WEBSITE_URL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={WEBSITE_URL} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </NextHead>
  );
};

export default Head;
