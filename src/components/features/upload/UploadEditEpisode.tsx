import { Episode } from "@/types";
import React from "react";
import { useForm } from "react-hook-form";

interface UploadEditEpisodeProps {
  episode: Episode;
}

const UploadEditEpisode: React.FC<UploadEditEpisodeProps> = ({ episode }) => {
  return <form>UploadEditEpisode</form>;
};

export default UploadEditEpisode;
