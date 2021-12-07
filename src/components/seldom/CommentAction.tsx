import Button from "@/components/shared/Button";
import CircleButton from "@/components/shared/CircleButton";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";

export type CommentActionType = "DELETE" | "EDIT";

interface CommentActionProps {
  onActionSelect?: (action: CommentActionType) => void;
}

const CommentAction: React.FC<CommentActionProps> = ({ onActionSelect }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <CircleButton
        onClick={() => setShow(!show)}
        LeftIcon={BiDotsHorizontalRounded}
        className="!bg-transparent hover:!bg-white/20 hover:!text-white"
      />

      {show && (
        <React.Fragment>
          <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />

          <div className="absolute z-50 min-w-[10rem] p-2 mt-2 space-y-2 rounded-md top-full bg-background-900">
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
        </React.Fragment>
      )}
    </div>
  );
};

export default CommentAction;
