import Avatar from "@/components/shared/Avatar";
import Section from "@/components/shared/Section";
import Swiper, { SwiperSlide } from "@/components/shared/Swiper";
import useNewestComments from "@/hooks/useNewestComments";
import dayjs from "@/lib/dayjs";
import { MediaType } from "@/types/anilist";
import { getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import CommentsSwiperSkeleton from "../skeletons/CommentsSwiperSkeleton";
import EmojiText from "./EmojiText";

interface NewestCommentsProps {
  type: MediaType;
}

const NewestComments: React.FC<NewestCommentsProps> = (props) => {
  const { data, isLoading } = useNewestComments(props.type);
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const isAnime = useMemo(() => props.type === MediaType.Anime, [props.type]);

  if (isLoading) {
    return <CommentsSwiperSkeleton />;
  }

  return data?.length ? (
    <Section title={t("recent_comments")}>
      <Swiper
        hideNavigation
        slidesPerGroup={1}
        breakpoints={{
          1536: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },

          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
        }}
      >
        {data.map((comment) => {
          const user = comment?.user?.user_metadata;
          const redirectUrl = isAnime
            ? `/anime/details/${comment.media?.id}`
            : `/manga/details/${comment.media?.id}`;
          const title = getTitle(comment.media, locale);

          return (
            <SwiperSlide key={comment.id}>
              <div className="w-full aspect-w-1 aspect-h-1 rounded-lg bg-background-800 overflow-y-hidden">
                <div className="flex flex-col justify-between space-y-2 md:space-y-4 w-full h-full p-4">
                  <div className="space-y-4">
                    <div className="shrink-0 flex items-center space-x-2">
                      <Avatar src={user?.avatar_url} />

                      <div className="space-y-1 text-sm">
                        <p className="line-clamp-1">{user?.name}</p>

                        <p className="text-gray-300 line-clamp-1">
                          {dayjs(comment.created_at, { locale }).fromNow()}
                        </p>
                      </div>
                    </div>

                    <EmojiText
                      className="text-ellipsis overflow-hidden"
                      text={comment.body}
                    />
                  </div>

                  <Link href={redirectUrl}>
                    <a
                      className="shrink-0 font-semibold line-clamp-1 text-sm block text-primary-300 hover:text-primary-400 transition duration-300"
                      title={title}
                    >
                      {title}
                    </a>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Section>
  ) : null;
};

export default React.memo(NewestComments);
