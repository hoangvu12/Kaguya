import React from "react";

interface ContextProps {
  sourceId: string;
  mediaId: number;
}

interface UploadMediaProviderProps {
  value: ContextProps;
}

const UploadMedia = React.createContext<ContextProps>(null);

export const UploadMediaProvider: React.FC<UploadMediaProviderProps> = ({
  children,
  value,
}) => {
  return <UploadMedia.Provider value={value}>{children}</UploadMedia.Provider>;
};

export const useUploadMediaInfo = () => {
  return React.useContext(UploadMedia);
};
