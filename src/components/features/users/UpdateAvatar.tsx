import Button from "@/components/shared/Button";
import useUpdateAvatar from "@/hooks/useUpdateAvatar";
import { AdditionalUser } from "@/types";
import React, { useRef, useState } from "react";
import { AiFillCamera } from "react-icons/ai";
import { IoMdCheckmark } from "react-icons/io";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface UpdateAvatarProps {
  user: AdditionalUser;
}

const UpdateAvatar: React.FC<UpdateAvatarProps> = ({ user }) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const avatarUrlRef = useRef<string>("");
  const fileRef = useRef<File>(null);

  const queryClient = useQueryClient();

  const { mutate: updateAvatar, isLoading: updateAvatarLoading } =
    useUpdateAvatar();

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

  const handleCancelPreview = () => {
    setIsPreviewing(false);

    fileRef.current = null;

    optimisticUpdate(() => {
      return { avatarUrl: avatarUrlRef.current };
    });
  };

  const handleAvatarPreview: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("No file selected.");

      return;
    }

    fileRef.current = file;

    setIsPreviewing(true);

    optimisticUpdate((old) => {
      avatarUrlRef.current = old.avatarUrl;

      return { avatarUrl: URL.createObjectURL(file) };
    });
  };

  const handleUpdateAvatar = async () => {
    updateAvatar(fileRef.current, {
      onSuccess: () => {
        setIsPreviewing(false);
        fileRef.current = null;
      },
    });
  };

  return (
    <React.Fragment>
      <label
        htmlFor="avatar-upload"
        className="absolute right-0 bottom-0 !bg-background-600 hover:!bg-background-400 cursor-pointer text-white text-base flex items-center justify-center p-2 rounded-full"
      >
        <AiFillCamera className="w-6 h-6" />
      </label>

      {isPreviewing && (
        <div className="mt-8 flex items-center gap-2 absolute bg-black/80">
          <Button
            className="shrink-0 bg-background-300 text-white"
            onClick={handleCancelPreview}
          >
            Cancel
          </Button>

          <Button
            isLoading={updateAvatarLoading}
            className="shrink-0 text-white"
            primary
            LeftIcon={IoMdCheckmark}
            onClick={handleUpdateAvatar}
          >
            Save changes
          </Button>
        </div>
      )}

      <input
        accept="image/*"
        id="avatar-upload"
        type="file"
        hidden
        onChange={handleAvatarPreview}
      />
    </React.Fragment>
  );
};

export default UpdateAvatar;
