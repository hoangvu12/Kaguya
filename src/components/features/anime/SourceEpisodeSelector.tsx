import ArrowSwiper, { SwiperSlide } from "@/components/shared/ArrowSwiper";
import { groupBy } from "@/utils";
import classNames from "classnames";
import React, { useMemo, useState } from "react";
import EpisodeSelector, { EpisodeSelectorProps } from "./EpisodeSelector";

const SourceEpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  episodes,
  activeEpisode,
  ...episodeSelectorProps
}) => {
  const sources = useMemo(
    () => groupBy(episodes, (episode) => episode.source.name),
    [episodes]
  );

  const defaultActiveSource = useMemo(
    () =>
      Object.keys(sources).find((source) =>
        sources[source].some(
          (episode) =>
            episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId
        )
      ),
    [sources, activeEpisode?.sourceEpisodeId]
  );

  const [activeSource, setActiveSource] = useState(
    defaultActiveSource || Object.keys(sources)[0]
  );

  const sourceEpisodes = useMemo(
    () => sources[activeSource],
    [sources, activeSource]
  );

  return (
    <React.Fragment>
      <ArrowSwiper isOverflowHidden={false} className="w-11/12 mx-auto mb-8">
        {Object.keys(sources).map((source, i) => (
          <SwiperSlide onClick={() => setActiveSource(source)} key={source}>
            <div
              className={classNames(
                "text-gray-300 cursor-pointer mx-auto rounded-[18px] px-2 py-1 w-[max-content] duration-300 transition",
                activeSource === source
                  ? "bg-white text-black"
                  : "hover:text-white"
              )}
            >
              {source}
            </div>
          </SwiperSlide>
        ))}
      </ArrowSwiper>

      <EpisodeSelector
        episodes={sourceEpisodes}
        activeEpisode={activeEpisode}
        {...episodeSelectorProps}
      />
    </React.Fragment>
  );
};

export default React.memo(SourceEpisodeSelector);
