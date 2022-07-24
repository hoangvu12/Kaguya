import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import classNames from "classnames";
import React, { useState } from "react";

const SpoilerNodeView = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <NodeViewWrapper className="inline-flex">
      <NodeViewContent
        as="span"
        className={classNames(
          !isVisible
            ? "relative cursor-pointer text-transparent max-w-max"
            : "bg-background-700"
        )}
      >
        {!isVisible && (
          <div
            className="inline-flex absolute inset-0 bg-background-500"
            onClick={handleClick}
          />
        )}
      </NodeViewContent>
    </NodeViewWrapper>
  );
};

export default SpoilerNodeView;
