import CircleButton from "@/components/shared/CircleButton";
import { spoilerExtension } from "@/utils/editor";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import classNames from "classnames";
import React, { useImperativeHandle } from "react";
import {
  AiOutlineBold,
  AiOutlineEyeInvisible,
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineSend,
  AiOutlineStrikethrough,
  AiOutlineUnderline,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { GrBlockQuote } from "react-icons/gr";
import { Editor as EditorType } from "@tiptap/react";

interface EditorProps extends Partial<EditorOptions> {
  defaultContent?: string;
  onSubmit?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  isLoading?: boolean;
}

const Editor = React.forwardRef<EditorType, EditorProps>(
  (
    {
      defaultContent,
      onSubmit,
      placeholder,
      readOnly,
      isLoading,
      ...editorOptions
    },
    ref
  ) => {
    const editor = useEditor(
      {
        extensions: [
          StarterKit,
          Underline,
          Placeholder.configure({
            placeholder,
            emptyNodeClass:
              "first:before:h-0 first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
          }),
          Mention.configure({
            HTMLAttributes: {
              class:
                "py-1 bg-primary-800 rounded-md decoration-clone text-white font-semibold",
            },
          }),
          spoilerExtension(),
        ],
        content: defaultContent,
        editorProps: {
          attributes: {
            class: classNames(
              "!max-w-full prose prose-sm prose-invert focus:outline-none focus:border-none",
              !readOnly && "min-h-[5rem]"
            ),
          },
        },
        editable: !readOnly,
        ...editorOptions,
      },
      [placeholder, readOnly, defaultContent]
    );

    useImperativeHandle(ref, () => editor, [editor]);

    return (
      <div className={classNames(!readOnly && "border border-gray-600")}>
        <EditorContent
          className={classNames(!readOnly && "p-4")}
          editor={editor}
        />

        {!readOnly && (
          <div className="p-4 flex flex-col md:flex-row justify-between border-t gap-2 border-gray-600">
            <div className="flex items-center md:gap-2 flex-wrap">
              <CircleButton
                secondary
                className="text-gray-300"
                LeftIcon={AiOutlineBold}
                onClick={() => editor.chain().toggleBold().focus().run()}
              />

              <CircleButton
                secondary
                className="text-gray-300"
                LeftIcon={AiOutlineUnderline}
                onClick={() => editor.chain().toggleUnderline().focus().run()}
              />

              <CircleButton
                secondary
                className="text-gray-300"
                LeftIcon={AiOutlineItalic}
                onClick={() => editor.chain().toggleItalic().focus().run()}
              />

              <CircleButton
                secondary
                className="text-gray-300"
                LeftIcon={AiOutlineUnorderedList}
                onClick={() => editor.chain().toggleBulletList().focus().run()}
              />

              <CircleButton
                secondary
                className="text-gray-300"
                LeftIcon={AiOutlineOrderedList}
                onClick={() => editor.chain().toggleOrderedList().focus().run()}
              />

              <CircleButton
                secondary
                className="text-gray-300"
                LeftIcon={AiOutlineStrikethrough}
                onClick={() => editor.chain().toggleStrike().focus().run()}
              />

              <CircleButton
                secondary
                className="text-gray-300"
                LeftIcon={GrBlockQuote}
                onClick={() => editor.chain().toggleBlockquote().focus().run()}
              />

              <CircleButton
                secondary
                className="text-gray-300"
                LeftIcon={AiOutlineEyeInvisible}
                onClick={() => editor.chain().setSpoiler().focus().run()}
              />
            </div>

            <CircleButton
              className="ml-auto max-w-min text-primary-300"
              secondary
              shortcutKey="enter"
              onClick={() => {
                if (editor.isEmpty) return;

                const html = editor.getHTML();

                onSubmit?.(html);
              }}
              isLoading={isLoading}
              disabled={editor?.isEmpty}
              LeftIcon={AiOutlineSend}
            />
          </div>
        )}
      </div>
    );
  }
);

Editor.displayName = "Editor";

export default Editor;
