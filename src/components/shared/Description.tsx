import React from "react";
import Editor, { EditorProps } from "../features/comment/Editor";
import { Editor as EditorType } from "@tiptap/react";

export interface DescriptionProps extends EditorProps {
  description: string;
}

const Description = React.forwardRef<EditorType, DescriptionProps>(
  ({ description, ...props }, ref) => {
    return (
      <Editor
        ref={ref}
        readOnly
        defaultContent={description}
        editorClassName="text-base text-gray-300 hover:text-gray-100"
        {...props}
      />
    );
  }
);

Description.displayName = "Description";

export default Description;
