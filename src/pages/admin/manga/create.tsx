import AdminLayout from "@/components/layouts/AdminLayout";
import Section from "@/components/shared/Section";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import JSONEditor from "@/components/shared/JSONEditor";
import Loading from "@/components/shared/Loading";
import useCreateData from "@/hooks/useCreateData";
import useFetchInfo from "@/hooks/useFetchInfo";
import { Manga } from "@/types";
import React, { useRef } from "react";
import { AiFillSave } from "react-icons/ai";

const MangaCreatePage = () => {
  const { onSubmit, register, isLoading, isError, data } =
    useFetchInfo("manga");
  const createMutation = useCreateData("manga");

  const json = useRef<Manga>();

  const handleOnChange = (text: string) => {
    json.current = JSON.parse(text);
  };

  const handleSave = () => {
    createMutation.mutate(json.current);
  };

  return (
    <Section title="Tạo Manga" className="space-y-4">
      <form onSubmit={onSubmit} className="w-full my-8">
        <div className="flex items-end md:justify-center space-x-2 snap-x overflow-x-auto">
          <Input
            {...register("id")}
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

          <Input
            {...register("slug")}
            className="px-3 py-2"
            placeholder="Nhập slug"
            label="Slug"
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
        ) : !data ? (
          <p className="text-center">Không có dữ liệu</p>
        ) : (
          <JSONEditor data={data} onChangeText={handleOnChange} />
        )}
      </div>

      {data && (
        <Button primary LeftIcon={AiFillSave} onClick={handleSave}>
          <p>Tạo</p>
        </Button>
      )}
    </Section>
  );
};

MangaCreatePage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default MangaCreatePage;
