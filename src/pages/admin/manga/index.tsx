import AdminLayout from "@/components/layouts/AdminLayout";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import Table from "@/components/shared/Table";
import useAdminBrowse from "@/hooks/useAdminBrowse";
import { Manga } from "@/types";
import { getTitle } from "@/utils/data";
import Link from "next/link";
import React from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { Column } from "react-table";

const columns: Column<Manga>[] = [
  {
    Header: "Ảnh",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;
      const title = getTitle(originalCell);

      return (
        <div className="p-2">
          <PlainCard src={originalCell.cover_image.extra_large} alt={title} />
        </div>
      );
    },
    accessor: "cover_image",
  },
  {
    Header: "Tên",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;

      const title = getTitle(originalCell);

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5">{title}</p>
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
        <Link href={`/admin/manga/${cell.value}`}>
          <a>
            <p className="text-primary-500 text-center">Chi tiết</p>
          </a>
        </Link>
      );
    },
    accessor: "ani_id",
  },
];

const AdminMangaPage = () => {
  const { data, isLoading, isError, onSubmit, register } =
    useAdminBrowse("manga");

  return (
    <div className="w-full h-full">
      <Section className="relative w-full h-full space-y-8" title="Manga">
        <Link href="/admin/manga/create">
          <a>
            <Button
              className="absolute right-5 top-0 mx-4 md:mx-12"
              secondary
              LeftIcon={AiOutlinePlus}
            >
              <p>Thêm manga</p>
            </Button>
          </a>
        </Link>

        <form onSubmit={onSubmit} className="w-full">
          <div className="flex items-end md:justify-center space-x-2 snap-x overflow-x-auto">
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
          </div>
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

AdminMangaPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminMangaPage;
