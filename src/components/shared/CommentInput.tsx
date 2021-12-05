import Avatar from "@/components/shared/Avatar";
import EmojiPicker from "@/components/shared/EmojiPicker";
import { useUser } from "@/contexts/AuthContext";
import { customEmojis } from "@/utils/emoji";
import { EmojiData } from "emoji-mart";
import React, { useCallback, useState } from "react";
import { ContentEditableEvent } from "react-contenteditable";
import ClientOnly from "./ClientOnly";
import EmojiText from "./EmojiText";

const CommentInput = () => {
  const user = useUser();
  const [html, setHTML] = useState("");

  const handleChange = useCallback((event: ContentEditableEvent) => {
    setHTML(event.target.value);
  }, []);

  const handleEmojiSelect = useCallback(
    (emojiData: EmojiData) => {
      setHTML(html + emojiData.colons);
    },
    [html]
  );

  return (
    <ClientOnly>
      {user ? (
        <div className="flex items-center w-full space-x-2">
          <Avatar src={user.user_metadata.avatar_url} />

          <div className="relative flex-1">
            <div className="relative bg-background-900">
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
