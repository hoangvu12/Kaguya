import AdminLayout from "@/components/layouts/AdminLayout";
import Section from "@/components/seldom/Section";
import Button from "@/components/shared/Button";
import JSONEditor from "@/components/shared/JSONEditor";
import Loading from "@/components/shared/Loading";
import useAnimeDetails from "@/hooks/useAnimeDetails";
import useEditAnime from "@/hooks/useEditAnime";
import { Anime } from "@/types";
import React, { useEffect, useRef } from "react";
import { AiFillSave } from "react-icons/ai";
import { RiDeleteBin7Fill } from "react-icons/ri";
import Link from "next/link";
import useDeleteAnime from "@/hooks/useDeleteAnime";

const composeData = ({
  relations,
  recommendations,
  characters,
  ...data
}: Anime) => data;

const AnimeAdminEditPage = ({ id }) => {
  const { data, isLoading, isError } = useAnimeDetails(Number(id));
  const json = useRef<Anime>();
  const editMutation = useEditAnime(Number(id));
  const deleteMutation = useDeleteAnime(Number(id));

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

        <Link href="/admin/anime">
          <a className="block px-3 py-2 rounded-md bg-primary-500 hover:bg-opacity-80 transition duration-300">
            Quay về
          </a>
        </Link>
      </div>
    );
  }

  const fallbackTitle =
    typeof data.title === "string" ? data.title : data.title.user_preferred;

  const title = data.vietnamese_title || fallbackTitle;

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

AnimeAdminEditPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
AnimeAdminEditPage.getInitialProps = async ({ query }) => {
  return {
    id: query.id,
  };
};

export default AnimeAdminEditPage;
