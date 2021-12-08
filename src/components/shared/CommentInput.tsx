import Avatar from "@/components/shared/Avatar";
import EmojiPicker from "@/components/shared/EmojiPicker";
import { useUser } from "@/contexts/AuthContext";
import { EmojiData } from "emoji-mart";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiSuggestion from "../seldom/EmojiSuggestion";
import ClientOnly from "./ClientOnly";
import EmojiText from "./EmojiText";

interface CommentInputProps {
  placeholder?: string;
  defaultHTML?: string;
  onEnter?: (text: string) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  placeholder = "Bày tỏ suy nghĩ của bạn.",
  defaultHTML = "",
  onEnter,
}) => {
  const user = useUser();
  const [html, setHTML] = useState(defaultHTML);
  const [latestText, setLatestText] = useState("");
  const inputRef = useRef<ContentEditable & HTMLDivElement>();
  const text = useRef("");

  const handleChange = useCallback((event: ContentEditableEvent) => {
    setHTML(event.target.value);
  }, []);

  const handleEmojiSelect = useCallback(
    (emojiData: EmojiData) => {
      setHTML(html + emojiData.colons);
    },
    [html]
  );

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

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        if (event.shiftKey) {
          setHTML((html) => html + "<br /><br />");
        } else {
          if (onEnter) {
            if (!text.current) return;

            onEnter?.(text.current);
          }

          setHTML("");
        }
      }
    };

    element.addEventListener("keydown", handleKeydown);

    return () => {
      element.removeEventListener("keydown", handleKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEnter, inputRef.current]);

  return (
    <ClientOnly>
      {user ? (
        <div className="flex w-full space-x-2">
          <Avatar
            className="flex-shrink-0"
            src={user.user_metadata.avatar_url}
          />

          <div className="relative flex-1">
            <div className="relative bg-background-900">
              <EmojiSuggestion
                text={latestText}
                className="absolute z-50 w-full bottom-full bg-background-900"
                onClick={handleEmojiSuggestionSelect}
              />

              {!html && (
                <p className="absolute z-0 px-3 text-gray-400 -translate-y-1/2 top-1/2">
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

            <div className="absolute right-0 z-10 flex items-center px-3 space-x-2 -translate-y-1/2 top-1/2">
              <EmojiPicker
                buttonClassName="p-2 transition duration-300 rounded-full hover:bg-white/20"
                onSelect={handleEmojiSelect}
                reference={<BsEmojiSmile className="w-6 h-6" />}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center p-3 rounded bg-background-900">
          <p className="text-gray-300">Bạn phải đăng nhập dể bình luận.</p>
        </div>
      )}
    </ClientOnly>
  );
};

export default React.memo(CommentInput);
