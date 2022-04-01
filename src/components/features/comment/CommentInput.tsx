import Avatar from "@/components/shared/Avatar";
import CircleButton from "@/components/shared/CircleButton";
import ClientOnly from "@/components/shared/ClientOnly";
import EmojiPicker from "@/components/shared/EmojiPicker";
import Input from "@/components/shared/Input";
import { useUser } from "@/contexts/AuthContext";
import useDevice from "@/hooks/useDevice";
import { insertTextAtCursor } from "@/utils";
import classNames from "classnames";
import { IEmojiData } from "emoji-picker-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { RiSendPlaneFill, RiSendPlaneLine } from "react-icons/ri";

const noop = () => {};
interface CommentInputProps {
  placeholder?: string;
  defaultText?: string;
  onEnter?: (text: string) => void;
  needLoginMessage?: React.ReactNode;
  showAvatar?: boolean;
}

const CommentInput: React.FC<CommentInputProps> = ({
  placeholder = "Bày tỏ suy nghĩ của bạn.",
  defaultText = "",
  onEnter,
  needLoginMessage = (
    <p className="text-gray-300">
      Bạn phải{" "}
      <Link href="/login">
        <a className="text-primary-300 hover:underline">đăng nhập</a>
      </Link>{" "}
      dể bình luận.
    </p>
  ),
  showAvatar = true,
}) => {
  const user = useUser();
  const [text, setText] = useState(defaultText);
  const inputRef = useRef<HTMLInputElement>();
  const { isDesktop } = useDevice();

  const handleChange = useCallback((event) => {
    const target = event.target as HTMLInputElement;

    setText(target.value);
  }, []);

  const handleEmojiSelect = useCallback((_: any, emojiData: IEmojiData) => {
    insertTextAtCursor(inputRef.current, emojiData.emoji);
  }, []);

  const handleSubmit = useCallback(() => {
    if (text) {
      onEnter?.(text);
      setText("");
    }
  }, [onEnter, text]);

  useEffect(() => {
    if (!inputRef.current) return;

    const element = inputRef.current;

    if (!element) return;

    const handleDesktopKeydown = (event: KeyboardEvent) => {
      if (!event.shiftKey && !event.ctrlKey && event.key === "Enter") {
        event.preventDefault();

        handleSubmit();
      }
    };

    element.addEventListener(
      "keydown",
      isDesktop ? handleDesktopKeydown : noop
    );

    return () => {
      element.removeEventListener(
        "keydown",
        isDesktop ? handleDesktopKeydown : noop
      );
    };
  }, [handleSubmit, isDesktop]);

  return (
    <ClientOnly>
      {user ? (
        <div className="flex w-full space-x-2">
          {showAvatar && (
            <Avatar className="shrink-0" src={user.user_metadata.avatar_url} />
          )}

          <div className="relative flex-1">
            <div className="relative bg-background-900">
              <Input
                value={text}
                ref={inputRef}
                onChange={handleChange}
                className="whitespace-pre-wrap relative z-10 px-3 py-2 comment-input focus:border-none focus:outline-none"
                placeholder={placeholder}
              />
            </div>

            <div className="mt-2 md:mt-0 md:absolute md:right-0 z-10 flex justify-end md:justify-start items-center md:px-3 md:space-x-2 md:-translate-y-1/2 md:top-1/2">
              <EmojiPicker
                buttonClassName="p-2 transition duration-300 rounded-full hover:bg-white/20"
                onEmojiClick={handleEmojiSelect}
                reference={<BsEmojiSmile className="w-6 h-6" />}
                disableAutoFocus
                disableSearchBar
              />

              {!isDesktop && (
                <CircleButton
                  className={classNames(text && "text-primary-500")}
                  LeftIcon={text ? RiSendPlaneFill : RiSendPlaneLine}
                  secondary
                  onClick={handleSubmit}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center p-3 rounded bg-background-900">
          {needLoginMessage}
        </div>
      )}
    </ClientOnly>
  );
};

export default React.memo(CommentInput);
