import { getConstantTranslation } from "@/utils/data";
import { useRouter } from "next/router";
import { useMemo } from "react";

const useConstantTranslation = () => {
  const { locale } = useRouter();
  const translations = useMemo(() => getConstantTranslation(locale), [locale]);

  return translations;
};

export default useConstantTranslation;
