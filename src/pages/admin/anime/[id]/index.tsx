import AdminLayout from "@/components/layouts/AdminLayout";
import CharacterCard from "@/components/shared/CharacterCard";
import DetailsSection from "@/components/shared/DetailsSection";
import InfoItem from "@/components/shared/InfoItem";
import Section from "@/components/shared/Section";
import DotList from "@/components/shared/DotList";
import List from "@/components/shared/List";
import Loading from "@/components/shared/Loading";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import useAnimeDetails from "@/hooks/useAnimeDetails";
import { numberWithCommas } from "@/utils";
import { convert, getTitle } from "@/utils/data";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiFillHeart, AiOutlineEdit } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

const AdminAnimeDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, isError } = useAnimeDetails(Number(id));

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data?.title) {
    return <p>Error...</p>;
  }

  const title = getTitle(data);

  return (
    <div className="w-full h-full">
      <Section title="Thông tin">
        <div className="relative !mb-8 flex space-y-4 md:flex-row flex-col md:space-y-0 md:space-x-4 bg-background-900 p-4 md:p-8">
          <div className="w-40 flex-shrink-0">
            <PlainCard data={data} />
          </div>

          <div className="space-y-4 self-end">
            <div className="space-y-4">
              <p className="text-3xl">{title}</p>
              <p className="text-lg line-clamp-5">{data.description}</p>
              <div className="flex flex-wrap items-center mt-4 text-lg gap-x-8">
                {data.average_score && (
                  <TextIcon
                    LeftIcon={MdTagFaces}
                    iconClassName="text-green-300"
                  >
                    <p>{data.average_score}%</p>
                  </TextIcon>
                )}
                <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                  <p>{numberWithCommas(data.favourites)}</p>
                </TextIcon>
                <DotList>
                  {data.genres.slice(0, 3).map((genre) => (
                    <p key={genre}>{convert(genre, "genre")}</p>
                  ))}
                </DotList>
              </div>
            </div>

            <div className="flex space-x-8 overflow-x-auto md:scroll-bar snap-x md:space-x-16">
              <InfoItem title="Quốc gia" value={data.country_of_origin} />
              <InfoItem title="Số tập" value={data.total_episodes} />

              {data.duration && (
                <InfoItem title="Thời lượng" value={`${data.duration} phút`} />
              )}

              <InfoItem
                title="Tình trạng"
                value={convert(data.status, "status")}
              />
              <InfoItem
                title="Giới hạn tuổi"
                value={data.is_adult ? "18+" : ""}
              />
            </div>
          </div>

          <Link href={`/admin/anime/${id}/edit`}>
            <a>
              <AiOutlineEdit className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-white/20 transition duration-300 cursor-pointer p-2" />
            </a>
          </Link>
        </div>

        <div className="space-y-12 md:col-span-8">
          {!!data?.characters?.length && (
            <DetailsSection
              title="Nhân vật"
              className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
            >
              {data.characters.map((character, index) => (
                <CharacterCard character={character} key={index} />
              ))}
            </DetailsSection>
          )}

          {!!data?.relations?.length && (
            <DetailsSection title="Anime liên quan">
              <List
                type="anime"
                data={data.relations.map((relation) => relation.anime)}
              />
            </DetailsSection>
          )}

          {!!data?.recommendations?.length && (
            <DetailsSection title="Anime hay khác">
              <List
                type="anime"
                data={data.recommendations.map(
                  (recommendation) => recommendation.anime
                )}
              />
            </DetailsSection>
          )}
        </div>
      </Section>
    </div>
  );
};

AdminAnimeDetails.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminAnimeDetails;
