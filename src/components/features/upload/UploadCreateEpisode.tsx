import { useUploadMediaInfo } from "@/contexts/UploadMediaContext";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import VideoUpload from "./VideoUpload";

// interface UploadCreateEpisodeProps {
//   episodeName
// }

const UploadCreateEpisode = () => {
  const { mediaId, sourceId } = useUploadMediaInfo();

  const { register, handleSubmit } = useForm();

  const onSubmit = (e) => {
    console.log(e);
  };

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <VideoUpload />
    // </form>
  );
};

export default UploadCreateEpisode;
