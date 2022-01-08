import AdminLayout from "@/components/layouts/AdminLayout";
import { useRouter } from "next/router";
import React from "react";

const MangaAdminEditPage = () => {
  const router = useRouter();

  console.log(router.query);

  return <div></div>;
};

MangaAdminEditPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default MangaAdminEditPage;
