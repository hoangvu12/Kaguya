import Avatar from "@/components/shared/Avatar";
import CircleButton from "@/components/shared/CircleButton";
import ClientOnly from "@/components/shared/ClientOnly";
import EmojiPicker from "@/components/shared/EmojiPicker";
import EmojiSuggestion from "@/components/shared/EmojiSuggestion";
import EmojiText from "@/components/shared/EmojiText";
import { useUser } from "@/contexts/AuthContext";
import useDevice from "@/hooks/useDevice";
import { insertBreaklineAtCursor, insertTextAtCursor } from "@/utils";
import classNames from "classnames";
import { EmojiData } from "emoji-mart";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { BsEmojiSmile } from "react-icons/bs";
import { RiSendPlaneFill, RiSendPlaneLine } from "react-icons/ri";

interface CommentInputProps {
  placeholder?: string;
  defaultHTML?: string;
  onEnter?: (text: string) => void;
  needLoginMessage?: React.ReactNode;
  showAvatar?: boolean;
}

const CommentInput: React.FC<CommentInputProps> = ({
  placeholder = "Bày tỏ suy nghĩ của bạn.",
  defaultHTML = "",
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
  const [html, setHTML] = useState(defaultHTML);
  const [latestText, setLatestText] = useState("");
  const inputRef = useRef<ContentEditable & HTMLDivElement>();
  const text = useRef("");
  const { isDesktop } = useDevice();

  const handleChange = useCallback((event: ContentEditableEvent) => {
    setHTML(event.target.value);
  }, []);

  const handleEmojiSelect = useCallback((emojiData: EmojiData) => {
    insertTextAtCursor(emojiData.colons);
  }, []);

  const handleEmojiSuggestionSelect = useCallback(
    (emoji: EmojiData) => {
      const index = html.lastIndexOf(latestText);
      const replacedHTML =
        html.substr(0, index) +
        emoji.colons +
        html.substr(index + latestText.length);

      setHTML(replacedHTML);

      const element = inputRef.current.getEl() as HTMLDivElement;
      element.focus();
    },
    [latestText, html]
  );

  const handleSubmit = useCallback(() => {
    if (text.current) {
      onEnter?.(text.current);
    }

    setHTML("");
  }, [onEnter]);

  useEffect(() => {
    const tempEl = document.createElement("div");

    tempEl.innerHTML = html;

    let rawText = "";

    tempEl.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        rawText += node.textContent;

        return;
      }

      if (node.nodeName === "IMG") {
        const imageNode = node as HTMLImageElement;

        rawText += `:${imageNode.dataset.emojiText}:`;
      }

      if (node.nodeName === "BR") {
        rawText += "\n";
      }
    });

    text.current = rawText;
  }, [html]);

  useEffect(() => {
    const tempEl = document.createElement("div");

    tempEl.innerHTML = html;

    const latestNode = tempEl.childNodes[tempEl.childNodes.length - 1];

    if (!latestNode) {
      setLatestText("");

      return;
    }

    if (latestNode.nodeName === "IMG") {
      setLatestText("");

      return;
    }

    setLatestText(
      latestNode.textContent
        .split(" ")
        .slice(-1)[0]
        .replace(/&nbsp;/g, " ")
        .trim()
    );
  }, [html]);

  useEffect(() => {
    if (!inputRef.current) return;

    const element = inputRef.current.getEl() as HTMLDivElement;

    if (!element) return;

    const handleDesktopKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        if (event.shiftKey) {
          insertBreaklineAtCursor();
        } else {
          handleSubmit();
        }
      }
    };

    const handleMobileKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        insertBreaklineAtCursor();
      }
    };

    element.addEventListener(
      "keydown",
      isDesktop ? handleDesktopKeydown : handleMobileKeydown
    );

    return () => {
      element.removeEventListener(
        "keydown",
        isDesktop ? handleDesktopKeydown : handleMobileKeydown
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef.current]);

  return (
    <ClientOnly>
      {user ? (
        <div className="flex w-full space-x-2">
          {showAvatar && (
            <Avatar className="shrink-0" src={user.user_metadata.avatar_url} />
          )}

          <div className="relative flex-1">
            <div className="relative bg-background-900">
              <EmojiSuggestion
                text={latestText}
                className="absolute z-50 w-full bottom-full bg-background-900"
                onClick={handleEmojiSuggestionSelect}
              />

              {!html && (
                <p className="absolute z-0 px-3 text-gray-400 -translate-y-1/2 top-1/2 line-clamp-1">
                  {placeholder}
                </p>
              )}

              <EmojiText
                ref={inputRef}
                text={html}
                onChange={handleChange}
                className="whitespace-pre-wrap relative z-10 px-3 py-2 comment-input focus:border-none focus:outline-none"
              />
            </div>

            <div className="mt-2 md:mt-0 md:absolute md:right-0 z-10 flex justify-end md:justify-start items-center md:px-3 md:space-x-2 md:-translate-y-1/2 md:top-1/2">
              <EmojiPicker
                buttonClassName="p-2 transition duration-300 rounded-full hover:bg-white/20"
                onSelect={handleEmojiSelect}
                reference={<BsEmojiSmile className="w-6 h-6" />}
              />

              {!isDesktop && (
                <CircleButton
                  className={classNames(html && "text-primary-500")}
                  LeftIcon={html ? RiSendPlaneFill : RiSendPlaneLine}
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
