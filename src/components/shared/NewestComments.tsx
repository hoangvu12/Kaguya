import Avatar from "@/components/shared/Avatar";
import Section from "@/components/shared/Section";
import Swiper, { SwiperSlide } from "@/components/shared/Swiper";
import useNewestComments from "@/hooks/useNewestComments";
import dayjs from "@/lib/dayjs";
import { MediaType } from "@/types/anilist";
import { createMediaDetailsUrl } from "@/utils";
import { getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Editor from "../features/comment/Editor";
import CommentsSwiperSkeleton from "../skeletons/CommentsSwiperSkeleton";

interface NewestCommentsProps {
  type: MediaType;
}

const NewestComments: React.FC<NewestCommentsProps> = (props) => {
  const { data, isLoading } = useNewestComments(props.type);
  const { t } = useTranslation("common");
  const { locale } = useRouter();

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
        {data.map(({ comment, media }) => {
          const user = comment?.user;
          const redirectUrl = createMediaDetailsUrl(media);
          const title = getTitle(media, locale);

          return (
            <SwiperSlide key={comment.id}>
              <div className="aspect-w-1 aspect-h-1 w-full overflow-y-hidden rounded-lg bg-background-800">
                <div className="flex h-full w-full flex-col justify-between space-y-2 p-4 md:space-y-4">
                  <div className="space-y-4">
                    <div className="flex shrink-0 items-center space-x-2">
                      <Avatar src={user?.avatar} />

                      <div className="space-y-1 text-sm">
                        <p className="line-clamp-1">{user?.name}</p>

                        <p className="text-gray-300 line-clamp-1">
                          {dayjs(comment.created_at, { locale }).fromNow()}
                        </p>
                      </div>
                    </div>

                    <Editor
                      className="line-clamp-2 md:line-clamp-4"
                      readOnly
                      defaultContent={comment.comment}
                    />
                  </div>

                  <Link href={redirectUrl}>
                    <a
                      className="block shrink-0 text-sm font-semibold text-primary-300 transition duration-300 line-clamp-1 hover:text-primary-400"
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
