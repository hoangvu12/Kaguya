import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";
import Button from "../shared/Button";
import CircleButton from "../shared/CircleButton";
import Popup from "../shared/Popup";

export type CommentActionType = "DELETE" | "EDIT";

interface CommentActionProps {
  onActionSelect?: (action: CommentActionType) => void;
}

const CommentAction: React.FC<CommentActionProps> = ({ onActionSelect }) => {
  return (
    <Popup
      reference={
        <CircleButton
          LeftIcon={BiDotsHorizontalRounded}
          className="!bg-transparent hover:!bg-white/20 hover:!text-white"
        />
      }
      type="click"
      placement="bottom"
      className="bg-background-900"
    >
      <div className="space-y-2 rounded-md">
        <Button
          className="w-full !bg-transparent hover:!bg-white/20"
          LeftIcon={BsPencil}
          iconClassName="w-5 h-5"
          onClick={() => onActionSelect?.("EDIT")}
        >
          <p className="text-sm">Chỉnh sửa</p>
        </Button>
        <Button
          className="w-full !bg-transparent hover:!bg-white/20"
          LeftIcon={AiOutlineDelete}
          iconClassName="w-5 h-5"
          onClick={() => onActionSelect?.("DELETE")}
        >
          <p className="text-sm">Xóa</p>
        </Button>
      </div>
    </Popup>
  );
};

export default CommentAction;
