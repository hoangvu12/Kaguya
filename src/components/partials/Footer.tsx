import { DISCORD_URL, FACEBOOK_URL } from "@/constants";
import React from "react";
import { AiFillFacebook } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";

interface FooterItemProps {
  Icon: React.ComponentType<any>;
  href: string;
}

const Footer = () => {
  return (
    <div className="w-full h-16 flex items-center justify-end px-4 md:px-12 space-x-4">
      <FooterItem href={DISCORD_URL} Icon={FaDiscord} />
      <FooterItem href={FACEBOOK_URL} Icon={AiFillFacebook} />
    </div>
  );
};

const FooterItem: React.FC<FooterItemProps> = ({ Icon, href }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Icon className="w-6 h-6 hover:text-primary-500 transition duration-300" />
    </a>
  );
};

export default Footer;
