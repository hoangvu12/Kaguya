import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Modal, { ModalRef } from "@/components/shared/Modal";
import { AdditionalUser } from "@/types";
import React, { useRef } from "react";
import { BiPencil } from "react-icons/bi";
import { Editor as EditorType } from "@tiptap/react";
import Editor from "../comment/Editor";
import { useQueryClient } from "react-query";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { toast } from "react-toastify";

interface EditProfileModalProps {
  user: AdditionalUser;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user }) => {
  const modalRef = useRef<ModalRef>();
  const nameInputRef = useRef<HTMLInputElement>();
  const usernameInputRef = useRef<HTMLInputElement>();
  const editorRef = useRef<EditorType>();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isLoading: updateProfileLoading } =
    useUpdateProfile();

  const optimisticUpdate = (
    updateFn: (oldData: AdditionalUser) => Partial<AdditionalUser>
  ) => {
    queryClient.setQueryData<AdditionalUser>(
      ["user-profile", user.id],

      (old) => {
        const newData = updateFn(old);

        return {
          ...old,
          ...newData,
        };
      }
    );
  };

  const handleSaveEdit = () => {
    const name = nameInputRef.current.value;
    const username = usernameInputRef.current.value;
    const bio = editorRef.current.isEmpty ? "" : editorRef.current.getHTML();

    if (!name || !username) {
      toast.error("Name and username are required.");

      return;
    }

    updateProfile(
      {
        name,
        username,
        bio,
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
        LeftIcon={BiPencil}
        className="font-semibold bg-background-500"
      >
        Edit profile
      </Button>

      <Modal className="w-full md:w-2/3" ref={modalRef}>
        <div className="space-y-4 my-8">
          <div className="flex items-center gap-4">
            <Input
              ref={nameInputRef}
              label="Name"
              defaultValue={user.name}
              containerClassName="grow"
              placeholder="Name"
              className="py-2 px-4 border border-gray-600"
            />

            <Input
              ref={usernameInputRef}
              label="Username"
              defaultValue={user.username}
              containerClassName="grow"
              placeholder="Username"
              className="py-2 px-4 border border-gray-600"
            />
          </div>

          <Editor
            ref={editorRef}
            editorClassName="min-h-[10rem] text-base text-gray-300 hover:text-gray-100"
            defaultContent={user.bio}
            placeholder="Bio"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button secondary onClick={handleModalState("close")}>
            <p>Cancel</p>
          </Button>
          <Button
            isLoading={updateProfileLoading}
            primary
            onClick={handleSaveEdit}
          >
            <p>Save</p>
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default EditProfileModal;
