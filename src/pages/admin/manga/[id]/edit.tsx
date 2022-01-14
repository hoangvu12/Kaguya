import AdminLayout from "@/components/layouts/AdminLayout";
import Section from "@/components/seldom/Section";
import Button from "@/components/shared/Button";
import JSONEditor from "@/components/shared/JSONEditor";
import Loading from "@/components/shared/Loading";
import useDeleteManga from "@/hooks/useDeleteManga";
import useEditManga from "@/hooks/useEditManga";
import useMangaDetails from "@/hooks/useMangaDetails";
import { Anime, Manga } from "@/types";
import { getTitle } from "@/utils/data";
import Link from "next/link";
import React, { useRef } from "react";
import { AiFillSave } from "react-icons/ai";
import { RiDeleteBin7Fill } from "react-icons/ri";

const composeData = ({
  relations,
  recommendations,
  characters,
  ...data
}: Manga) => data;

const MangaAdminEditPage = ({ id }) => {
  const { data, isLoading, isError } = useMangaDetails(Number(id));
  const json = useRef<Manga>();
  const editMutation = useEditManga(Number(id));
  const deleteMutation = useDeleteManga(Number(id));

  const handleOnChange = (text: string) => {
    json.current = JSON.parse(text);
  };

  const handleSave = () => {
    editMutation.mutate(json.current);
  };

  const handleDelete = () => {
    deleteMutation.mutate(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error</p>;
  }

  if (!data) {
    return (
      <div className="text-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4">
        <p>Không có dữ liệu</p>

        <Link href="/admin/manga">
          <a className="block px-3 py-2 rounded-md bg-primary-500 hover:bg-opacity-80 transition duration-300">
            Quay về
          </a>
        </Link>
      </div>
    );
  }

  const title = getTitle(data);

  return (
    <Section title={`Chỉnh sửa thông tin "${title}"`}>
      <JSONEditor data={composeData(data)} onChangeText={handleOnChange} />

      <div className="flex items-center space-x-2 ml-auto">
        <Button primary LeftIcon={RiDeleteBin7Fill} onClick={handleDelete}>
          <p>Xóa</p>
        </Button>
        <Button
          className="text-black"
          LeftIcon={AiFillSave}
          onClick={handleSave}
        >
          <p>Lưu thông tin</p>
        </Button>
      </div>
    </Section>
  );
};

MangaAdminEditPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
MangaAdminEditPage.getInitialProps = async ({ query }) => {
  return {
    id: query.id,
  };
};

export default MangaAdminEditPage;
