import Avatar from "@/components/shared/Avatar";
import Section from "@/components/shared/Section";
import Swiper, { SwiperSlide } from "@/components/shared/Swiper";
import useNewestComments from "@/hooks/useNewestComments";
import dayjs from "@/lib/dayjs";
import { getTitle } from "@/utils/data";
import Link from "next/link";
import React, { PropsWithChildren, useMemo } from "react";
import CommentsSwiperSkeleton from "../skeletons/CommentsSwiperSkeleton";
import EmojiText from "./EmojiText";

interface NewestCommentsProps<T> {
  type: T;
}

const NewestComments = <T extends "anime" | "manga">(
  props: PropsWithChildren<NewestCommentsProps<T>>
) => {
  const { data, isLoading } = useNewestComments(props.type);

  const isAnime = useMemo(() => props.type === "anime", [props.type]);

  if (isLoading) {
    return <CommentsSwiperSkeleton />;
  }

  return data?.length ? (
    <Section title="Bình luận gần đây">
      <Swiper
        freeMode
        breakpoints={{
          1280: {
            slidesPerView: 5,
            slidesPerGroup: 5,
          },
          1024: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          640: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
        }}
      >
        {data.map((comment) => {
          const user = comment?.user?.user_metadata;
          const source = isAnime ? comment.anime : comment.manga;
          const redirectUrl = isAnime
            ? `/anime/details/${source?.ani_id}`
            : `/manga/details/${source?.ani_id}`;

          return (
            <SwiperSlide key={comment.id}>
              <div className="w-full aspect-w-1 aspect-h-1 rounded-lg bg-background-800">
                <div className="flex flex-col space-y-4 w-full h-full p-4">
                  <div className="flex items-center space-x-2">
                    <Avatar src={user?.avatar_url} />

                    <div className="space-y-1 text-sm">
                      <p className="line-clamp-1">{user?.name}</p>

                      <p className="text-gray-300 line-clamp-1">
                        {dayjs(comment.created_at).fromNow()}
                      </p>
                    </div>
                  </div>

                  <EmojiText
                    disabled
                    className="flex-grow overflow-ellipsis overflow-hidden"
                    text={comment.body}
                  />

                  <Link href={redirectUrl}>
                    <a className="font-semibold line-clamp-1 text-sm block text-primary-300 hover:text-primary-400 transition duration-300">
                      {getTitle(source)}
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
