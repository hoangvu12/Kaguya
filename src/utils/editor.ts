import SpoilerNodeView from "@/components/features/comment/SpoilerNodeView";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import {
  generateJSON,
  mergeAttributes,
  Node,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import traverse from "traverse";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    spoiler: {
      /**
       * Set a spoiler
       */
      setSpoiler: () => ReturnType;
    };
  }
}

export const getMentionedUserIds = (doc: string): string[] => {
  const userIds: string[] = [];

  const json = generateJSON(doc, [StarterKit, Placeholder, Mention]);

  traverse(json).forEach(function (node) {
    if (node?.type === "mention") {
      userIds.push(node.attrs.id);
    }
  });

  return userIds;
};

export const spoilerExtension = () => {
  return Node.create({
    name: "spoiler",

    group: "inline",

    inline: true,

    content: "inline",

    defining: true,

    addAttributes() {
      return {
        spoiler: {
          default: "true",
          parseHTML: (el) =>
            (el as HTMLSpanElement).getAttribute("data-spoiler"),
          renderHTML: ({ spoiler }) => ({ "data-spoiler": spoiler }),
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: "span[data-spoiler]",
          getAttrs: (el) =>
            !!(el as HTMLDivElement).getAttribute("data-spoiler")?.trim() &&
            null,
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "span",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        0,
      ];
    },

    addCommands() {
      return {
        setSpoiler:
          () =>
          ({ chain, state }) => {
            const { from, to } = state.selection;

            const selectionText = state.doc.textBetween(from, to);

            return chain()
              .focus()
              .insertContentAt(
                { from, to },
                {
                  type: this.name,
                  content: [
                    {
                      type: "text",
                      text: selectionText,
                    },
                  ],
                }
              )
              .run();
          },
      };
    },

    addNodeView() {
      return ReactNodeViewRenderer(SpoilerNodeView);
    },
  });
};
