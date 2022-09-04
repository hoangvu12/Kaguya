import useSaveTranslation from "@/hooks/useSaveTranslation";
import { MediaType } from "@/types/anilist";
import { Editor as EditorType } from "@tiptap/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { AiOutlineTranslation } from "react-icons/ai";
import Editor from "../features/comment/Editor";
import Button from "./Button";
import Input from "./Input";
import Modal, { ModalRef } from "./Modal";

interface AddTranslationModalProps {
  mediaId: number;
  mediaType: MediaType;
  defaultTitle?: string;
  defaultDescription?: string;
}

const AddTranslationModal: React.FC<AddTranslationModalProps> = ({
  mediaId,
  mediaType,
  defaultTitle,
  defaultDescription,
}) => {
  const { t } = useTranslation("translation_modal");
  const modalRef = useRef<ModalRef>();
  const titleInputRef = useRef<HTMLInputElement>();
  const editorRef = useRef<EditorType>();
  const { mutate: saveTranslation, isLoading } = useSaveTranslation(
    mediaId,
    mediaType
  );
  const { locale } = useRouter();

  const handleSaveTranslation = () => {
    const title = titleInputRef.current.value;
    const description = editorRef.current?.getHTML();

    saveTranslation(
      {
        description,
        title,
        locale,
      },
      {
        onSuccess: () => {
          modalRef.current.close();
        },
      }
    );
  };

  const handleModalState = (state: "open" | "close") => () => {
    if (state === "open") {
      modalRef.current.open();
    } else if (state === "close") {
      modalRef.current.close();
    }
  };

  return (
    <React.Fragment>
      <Button
        onClick={handleModalState("open")}
        secondary
        className="w-full"
        LeftIcon={AiOutlineTranslation}
      >
        <p>{t("add_translation_button")}</p>
      </Button>

      <Modal ref={modalRef}>
        <h1 className="text-2xl font-semibold">{t("modal_heading")}</h1>

        <div className="space-y-4 my-8">
          <Input
            ref={titleInputRef}
            label={t("modal_media-title")}
            defaultValue={defaultTitle}
            containerClassName="grow"
            placeholder="Title"
            className="py-2 px-4 border border-gray-600"
          />

          <div className="space-y-2">
            <label className="font-semibold">
              {t("modal_media-description")}
            </label>

            <Editor
              ref={editorRef}
              editorClassName="text-base text-gray-300 hover:text-gray-100"
              defaultContent={defaultDescription}
            />
          </div>
        </div>

        <p className="italic text-gray-300">{t("modal_translation-notice")}</p>

        <div className="flex items-center justify-end gap-2">
          <Button secondary onClick={handleModalState("close")}>
            <p>{t("modal_cancel")}</p>
          </Button>
          <Button isLoading={isLoading} onClick={handleSaveTranslation} primary>
            <p>{t("modal_save")}</p>
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default AddTranslationModal;
