import Button from "@/components/shared/Button";
import CircleButton from "@/components/shared/CircleButton";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";
import Popup from "@/components/shared/Popup";
import { useTranslation } from "next-i18next";

export type CommentActionType = "DELETE" | "EDIT";

interface CommentActionProps {
  onActionSelect?: (action: CommentActionType) => void;
}

const CommentAction: React.FC<CommentActionProps> = ({ onActionSelect }) => {
  const { t } = useTranslation("comment");

  return (
    <Popup
      type="click"
      reference={
        <CircleButton
          LeftIcon={BiDotsHorizontalRounded}
          className="!bg-transparent hover:!bg-white/20 hover:!text-white"
        />
      }
      placement="bottom"
    >
      <div className="mt-2 space-y-2 rounded-md top-full bg-background-900">
        <Button
          className="w-full !bg-transparent hover:!bg-white/20"
          LeftIcon={BsPencil}
          iconClassName="w-5 h-5"
          onClick={() => onActionSelect?.("EDIT")}
        >
          <p className="text-sm">{t("comment_edit")}</p>
        </Button>
        <Button
          className="w-full !bg-transparent hover:!bg-white/20"
          LeftIcon={AiOutlineDelete}
          iconClassName="w-5 h-5"
          onClick={() => onActionSelect?.("DELETE")}
        >
          <p className="text-sm">{t("comment_delete")}</p>
        </Button>
      </div>
    </Popup>
  );
};

export default CommentAction;
