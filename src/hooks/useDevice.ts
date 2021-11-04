import { isMobile, isDesktop } from "react-device-detect";

const useDevice = () => {
  return {
    isMobile,
    isDesktop,
  };
};

export default useDevice;
