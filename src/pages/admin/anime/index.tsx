import AdminLayout from "@/components/layouts/AdminLayout";
import Section from "@/components/seldom/Section";
import Loading from "@/components/shared/Loading";
import PlainCard from "@/components/shared/PlainCard";
import Table from "@/components/shared/Table";
import useAnimeList from "@/hooks/useAnimeList";
import { Anime } from "@/types";
import Link from "next/link";
import React from "react";
import { Column } from "react-table";

const columns: Column<Anime>[] = [
  {
    Header: "Ảnh",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;

      return (
        <div className="p-2">
          <PlainCard data={originalCell}></PlainCard>
        </div>
      );
    },
    accessor: "cover_image",
  },
  {
    Header: "Tên",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;

      const title =
        typeof originalCell.title === "string"
          ? originalCell.title
          : originalCell.title.user_preferred;

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5">
            {originalCell.vietnamese_title || title}
          </p>
        </div>
      );
    },
    accessor: "title",
  },
  {
    Header: "Nội dung",
    accessor: "description",
    Cell: ({ cell }) => {
      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5 overflow-hidden">{cell.value}</p>
        </div>
      );
    },
  },
  {
    Header: "Hành động",
    Cell: ({ cell }) => {
      return (
        <Link href={`/admin/anime/${cell.value}`}>
          <a>
            <p className="text-primary-500 text-center">Chi tiết</p>
          </a>
        </Link>
      );
    },
    accessor: "ani_id",
  },
];

const AdminAnimePage = () => {
  const { data, isLoading, isError } = useAnimeList();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <div className="w-full h-full">
      <Section className="w-full" title="Anime">
        <Table columns={columns} data={data}></Table>
      </Section>
    </div>
  );
};

// @ts-ignore
AdminAnimePage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminAnimePage;
