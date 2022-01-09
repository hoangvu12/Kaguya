import AdminLayout from "@/components/layouts/AdminLayout";
import Section from "@/components/seldom/Section";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import PlainCard from "@/components/shared/PlainCard";
import Table from "@/components/shared/Table";
import useAdminBrowse from "@/hooks/useAdminBrowse";
import { Anime } from "@/types";
import Link from "next/link";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
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
  const { data, isLoading, isError, onSubmit, register } =
    useAdminBrowse("anime");

  return (
    <div className="w-full h-full">
      <Section className="w-full h-full space-y-8" title="Anime">
        <form
          onSubmit={onSubmit}
          className="flex items-end justify-center space-x-2 snap-x"
        >
          <Input
            {...register("keyword")}
            placeholder="Nhập từ khóa"
            LeftIcon={AiOutlineSearch}
            label="Từ khóa"
          />

          <Input
            {...register("ani_id")}
            className="px-3 py-2"
            placeholder="Nhập ID"
            label="Anilist ID"
          />

          <Input
            {...register("source_id")}
            className="px-3 py-2"
            placeholder="Nhập ID"
            label="Source ID"
          />

          <Button type="submit" primary>
            <p>Tìm kiếm</p>
          </Button>
        </form>

        <div className="relative w-full h-full">
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <p className="text-center">Lỗi</p>
          ) : !data?.length ? (
            <p className="text-center">Không có dữ liệu</p>
          ) : (
            <Table columns={columns} data={data}></Table>
          )}
        </div>
      </Section>
    </div>
  );
};

// @ts-ignore
AdminAnimePage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminAnimePage;
