import { Comment } from "@/types";
import React, { createContext, useContext, useMemo, useState } from "react";

// https://github.com/malerba118/supabase-comments-extension/blob/5680c36877a69532ddab6cd8d0875a9f9500f0dd/src/components/ReplyManagerProvider.tsx#L11
interface CommentReplyContextValue {
  replyingTo: Comment | null;
  setReplyingTo: React.Dispatch<React.SetStateAction<Comment>>;
}

const CommentReplyContext =
  createContext<CommentReplyContextValue | null>(null);

export const useCommentReply = () => {
  return useContext(CommentReplyContext);
};

const CommentReplyContextProvider: React.FC = ({ children }) => {
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  const api = useMemo(
    () => ({
      replyingTo,
      setReplyingTo,
    }),
    [replyingTo, setReplyingTo]
  );

  return (
    <CommentReplyContext.Provider value={api}>
      {children}
    </CommentReplyContext.Provider>
  );
};

export default CommentReplyContextProvider;
