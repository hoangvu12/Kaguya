import EditProfileModal from "@/components/features/users/EditProfileModal";
import UpdateAvatar from "@/components/features/users/UpdateAvatar";
import UpdateBanner from "@/components/features/users/UpdateBanner";
import Avatar from "@/components/shared/Avatar";
import Description from "@/components/shared/Description";
import Head from "@/components/shared/Head";
import Section from "@/components/shared/Section";
import { useUser } from "@/contexts/AuthContext";
import useUserProfile from "@/hooks/useUserProfile";
import supabaseClient from "@/lib/supabase";
import { AdditionalUser, SourceStatus } from "@/types";
import { GetServerSideProps, NextPage } from "next";
import React, { useMemo, useState } from "react";
import WatchList from "@/components/features/users/WatchList";
import { MediaType } from "@/types/anilist";
import ReadList from "@/components/features/users/ReadList";
import Button from "@/components/shared/Button";
import classNames from "classnames";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { useTranslation } from "next-i18next";

interface UserPageProps {
  user: AdditionalUser;
}

const LISTS = {
  Watch: "WATCH",
  Read: "READ",
} as const;

type ListKey = keyof typeof LISTS;
type List = typeof LISTS[ListKey];

const UserPage: NextPage<UserPageProps> = ({ user }) => {
  const currentUser = useUser();

  const { USER_LIST } = useConstantTranslation();

  const { t } = useTranslation("user_profile");

  type UserList = typeof USER_LIST[number];

  const getList = (list: List) => {
    return USER_LIST.find((userList) => userList.value === list);
  };

  const { data: userProfile } = useUserProfile(user);
  const [listTab, setListTab] = useState<UserList>(getList(LISTS.Watch));

  const isOwnProfile = useMemo(
    () => currentUser?.id === user.id,
    [currentUser?.id, user?.id]
  );

  const handleListTabChange = (list: UserList) => () => {
    setListTab(list);
  };

  return (
    <React.Fragment>
      <Head
        title={`${user.name} (@${user.username}) - Kaguya`}
        image={user.bannerUrl}
        description={`Profile page of ${user.name} (@${user.username}) ${
          user.bio ? ` - "${user.bio}"` : ""
        }`}
      />

      <div className="w-full min-h-screen">
        <div className="pt-16 md:pt-0 bg-background-800 w-full flex items-center">
          <Section className="px-0 overflow-hidden relative mx-auto w-full h-[200px] md:h-[400px]">
            <div className="relative w-full h-full">
              {userProfile.bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userProfile.bannerUrl}
                  className="w-full h-full object-cover"
                  alt="profile banner"
                />
              ) : (
                <div className="w-full h-full bg-background-700"></div>
              )}

              <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
            </div>

            {isOwnProfile && <UpdateBanner user={userProfile} />}
          </Section>
        </div>

        <Section className="bg-background-800 pb-8 -mt-16 flex flex-col md:flex-row gap-4 md:items-center justify-between pt-6 w-full">
          <div className="relative flex flex-col md:flex-row gap-8">
            <div className="border-4 border-background-800 relative rounded-full w-32 h-32 md:w-44 md:h-44">
              <Avatar
                src={userProfile.avatarUrl}
                className="mx-auto !w-full !h-full"
              />

              {isOwnProfile && <UpdateAvatar user={user} />}
            </div>

            <div className="md:pt-16 space-y-2">
              <div className="flex flex-col md:flex-row center gap-4">
                <h1 className="text-4xl font-bold">{userProfile.name}</h1>

                <h3 className="flex items-center text-2xl text-gray-300">
                  @{userProfile.username}
                </h3>
              </div>

              <Description description={userProfile.bio || t("no_bio")} />
            </div>
          </div>

          {isOwnProfile && (
            <div>
              <EditProfileModal user={userProfile} />
            </div>
          )}
        </Section>

        <Section title={t("list_heading")} className="mt-8 w-full">
          <div className="flex items-center gap-3">
            <Button
              className={classNames(
                listTab.value === LISTS.Watch
                  ? "bg-primary-600"
                  : "bg-background-600"
              )}
              onClick={handleListTabChange(getList(LISTS.Watch))}
            >
              {getList(LISTS.Watch).label}
            </Button>
            <Button
              className={classNames(
                listTab.value === LISTS.Read
                  ? "bg-primary-600"
                  : "bg-background-600"
              )}
              onClick={handleListTabChange(getList(LISTS.Read))}
            >
              {getList(LISTS.Read).label}
            </Button>
          </div>

          <div className="mt-8">
            {listTab.value === LISTS.Watch ? (
              <WatchList user={user} />
            ) : (
              <ReadList user={user} />
            )}
          </div>
        </Section>
      </div>
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { username } = ctx.params;

  const { data: user, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user,
    },
  };
};

export default UserPage;
