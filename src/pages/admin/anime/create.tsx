import AdminLayout from "@/components/layouts/AdminLayout";
import Section from "@/components/shared/Section";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import JSONEditor from "@/components/shared/JSONEditor";
import Loading from "@/components/shared/Loading";
import useFetchInfo from "@/hooks/useFetchInfo";
import useCreateData from "@/hooks/useCreateData";
import { Anime } from "@/types";
import React, { useRef } from "react";
import { AiFillSave } from "react-icons/ai";

const AnimeCreatePage = () => {
  const { onSubmit, register, isLoading, isError, data } =
    useFetchInfo("anime");
  const createMutation = useCreateData("anime");

  const json = useRef<Anime>();

  const handleOnChange = (text: string) => {
    json.current = JSON.parse(text);
  };

  const handleSave = () => {
    createMutation.mutate(json.current);
  };

  return (
    <Section title="Tạo Anime" className="space-y-4">
      <form onSubmit={onSubmit} className="w-full my-8">
        <div className="flex items-end md:justify-center space-x-2 snap-x overflow-x-auto">
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

AnimeCreatePage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AnimeCreatePage;
