import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import Portal from "@/components/shared/Portal";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import useThemeSearch from "@/hooks/useThemeSearch";
import { debounce } from "@/utils";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ThemeCard from "./ThemeCard";

interface SearchProps {
  className?: string;
}

const ThemeSearch: React.FC<SearchProps> = ({ className }) => {
  const [show, setShow] = useState(false);
  const { theme } = useThemePlayer();
  const [keyword, setKeyword] = useState(theme?.name);
  const { data, isLoading } = useThemeSearch(keyword, show);

  useEffect(() => {
    if (!theme?.name) return;

    setKeyword(theme.name);
  }, [theme?.name]);

  const handleInputChange: React.FormEventHandler<HTMLInputElement> = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    500
  );

  return (
    <React.Fragment>
      <AiOutlineSearch
        className={className}
        onClick={(e) => {
          e.stopPropagation();

          setShow(true);
        }}
      />

      {show && (
        <Portal>
          <div
            className="fixed inset-0 z-40 bg-black/80"
            onClick={(e) => {
              e.stopPropagation();

              setShow(false);
            }}
          ></div>

          <div
            className="absolute h-5/6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 fixed inset-0 flex flex-col items-center space-y-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="w-full">
              <Input
                containerInputClassName="border border-white/80"
                LeftIcon={AiOutlineSearch}
                placeholder="Theme search"
                value={keyword}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative h-full w-full overflow-y-scroll no-scrollbar">
              {isLoading ? (
                <Loading />
              ) : (
                <div className="w-full h-full space-y-2 overflow-y-scroll bg-background-900 no-scrollbar">
                  {data?.search?.anime?.length ? (
                    data.search.anime.map((anime) => (
                      <ThemeCard anime={anime} key={anime.id} />
                    ))
                  ) : (
                    <p>No results</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default ThemeSearch;
