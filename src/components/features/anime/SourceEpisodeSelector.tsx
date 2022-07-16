import Select from "@/components/shared/Select";
import { groupBy } from "@/utils";
import React, { useMemo, useState } from "react";
import EpisodeSelector, { EpisodeSelectorProps } from "./EpisodeSelector";

export interface SourceEpisodeSelectorProps extends EpisodeSelectorProps {}

const sourcesToOptions = (sources: string[]) =>
  sources.map((source) => ({ value: source, label: source }));

const SourceEpisodeSelector: React.FC<SourceEpisodeSelectorProps> = ({
  episodes,
  activeEpisode,
  ...episodeSelectorProps
}) => {
  const verifiedSources = useMemo(() => {
    const verifiedEpisodes = episodes.filter(
      (episode) => episode.source.isCustomSource
    );

    return groupBy(verifiedEpisodes, (episode) => episode.source.name);
  }, [episodes]);

  const nonVerifiedSources = useMemo(() => {
    const nonVerifiedEpisodes = episodes.filter(
      (episode) => !episode.source.isCustomSource
    );

    return groupBy(nonVerifiedEpisodes, (episode) => episode.source.name);
  }, [episodes]);

  const sources = useMemo(() => {
    return { ...verifiedSources, ...nonVerifiedSources };
  }, [nonVerifiedSources, verifiedSources]);

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

  console.log(defaultActiveSource, Object.keys(sources)[0]);

  const sourceEpisodes = useMemo(
    () => sources[activeSource],
    [sources, activeSource]
  );

  return (
    <React.Fragment>
      <div className="flex justify-end w-full mx-auto mb-8">
        <Select
          options={[
            {
              label: "Verified",
              options: sourcesToOptions(Object.keys(verifiedSources)),
            },
            {
              label: "Not verified",
              options: sourcesToOptions(Object.keys(nonVerifiedSources)),
            },
          ]}
          onChange={({ value }) => {
            setActiveSource(value);
          }}
          defaultValue={{ value: activeSource, label: activeSource }}
          isClearable={false}
        />
      </div>

      <EpisodeSelector
        episodes={sourceEpisodes}
        activeEpisode={activeEpisode}
        {...episodeSelectorProps}
      />
    </React.Fragment>
  );
};

export default React.memo(SourceEpisodeSelector);
