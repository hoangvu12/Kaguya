import AdminLayout from "@/components/layouts/AdminLayout";
import Section from "@/components/seldom/Section";
import StatisticBox from "@/components/seldom/StatisticBox";
import supabase from "@/lib/supabase";
import { NextPage } from "next";
import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { CgGhostCharacter } from "react-icons/cg";
import { GiCrownedSkull } from "react-icons/gi";

interface AdminHomePageProps {
  animeCount: number;
  mangaCount: number;
  userCount: number;
}

const AdminHomePage: NextPage<AdminHomePageProps> = ({
  animeCount,
  userCount,
  mangaCount,
}) => {
  return (
    <div className="w-full h-full">
      <Section title="Thông tin chung">
        <div className="grid h-1/2 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <StatisticBox
            title="Tổng anime"
            value={animeCount}
            Icon={GiCrownedSkull}
            className="col-span-1"
          />

          <StatisticBox
            title="Tổng manga"
            value={mangaCount}
            Icon={CgGhostCharacter}
            className="col-span-1"
          />

          <StatisticBox
            title="Người dùng"
            value={userCount}
            Icon={AiOutlineUser}
            className="col-span-1"
          />
        </div>
      </Section>
    </div>
  );
};

// @ts-ignore
AdminHomePage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export const getServerSideProps = async (ctx) => {
  const { count: animeCount } = await supabase
    .from("anime")
    .select("id", { count: "exact" });
  const { count: mangaCount } = await supabase
    .from("manga")
    .select("id", { count: "exact" });
  const { count: userCount } = await supabase
    .from("users")
    .select("id", { count: "exact" });

  return {
    props: {
      animeCount,
      mangaCount,
      userCount,
    },
  };
};

export default AdminHomePage;
