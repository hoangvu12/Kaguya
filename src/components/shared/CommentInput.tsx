import Avatar from "@/components/shared/Avatar";
import EmojiPicker from "@/components/shared/EmojiPicker";
import { useUser } from "@/contexts/AuthContext";
import { customEmojis } from "@/utils/emoji";
import { EmojiData } from "emoji-mart";
import React, { useCallback, useEffect, useState } from "react";
import { ContentEditableEvent } from "react-contenteditable";
import EmojiSuggestion from "../seldom/EmojiSuggestion";
import ClientOnly from "./ClientOnly";
import EmojiText from "./EmojiText";

const CommentInput = () => {
  const user = useUser();
  const [html, setHTML] = useState("");
  const [latestText, setLatestText] = useState("");

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
      setLatestText("");
    },
    [latestText, html]
  );

  const isShowEmojiSuggestion = latestText[0] === ":" && latestText.length > 2;

  useEffect(() => {
    const tempEl = document.createElement("div");

    tempEl.innerHTML = html;

    const latestNode = tempEl.childNodes[tempEl.childNodes.length - 1];

    if (!latestNode) return;

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

  return (
    <ClientOnly>
      {user ? (
        <div className="flex items-center w-full space-x-2">
          <Avatar src={user.user_metadata.avatar_url} />

          <div className="relative flex-1">
            <div className="relative bg-background-900">
              {isShowEmojiSuggestion && (
                <EmojiSuggestion
                  text={latestText}
                  className="absolute z-50 w-full bottom-full bg-background-900"
                  onClick={handleEmojiSuggestionSelect}
                />
              )}

              {!html && (
                <p className="absolute z-0 px-3 text-gray-400 -translate-y-1/2 top-1/2">
                  Nêu suy nghĩ của bạn...
                </p>
              )}

              <EmojiText
                text={html}
                onChange={handleChange}
                className="relative z-10 px-3 py-2 focus:border-none focus:outline-none"
              />
            </div>

            <div className="absolute right-0 z-10 flex items-center px-3 space-x-2 -translate-y-1/2 top-1/2">
              <EmojiPicker
                title="Kaguya"
                onSelect={handleEmojiSelect}
                set="facebook"
                custom={customEmojis}
                emoji="grinning"
                color="#EF4444"
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

export default CommentInput;
