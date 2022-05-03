import { Placement } from "@popperjs/core";
import type { IEmojiPickerProps } from "emoji-picker-react";
import React, { useState } from "react";
import { usePopper } from "react-popper";
import Portal from "@/components/shared/Portal";
import dynamic from "next/dynamic";
import useConstantTranslation from "@/hooks/useConstantTranslation";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface EmojiPickerProps extends IEmojiPickerProps {
  reference: React.ReactNode;
  buttonClassName?: string;
  placement?: Placement;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  reference,
  buttonClassName,
  placement = "top",
  ...props
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const { EMOJI_GROUP } = useConstantTranslation();
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 20],
        },
      },
      {
        name: "preventOverflow",
        options: {
          altAxis: true,
          padding: 40,
        },
      },
    ],
    placement,
  });

  const handleToggle = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div className="relative">
      <button
        ref={setReferenceElement}
        onClick={handleToggle}
        className={buttonClassName}
      >
        {reference}
      </button>

      {showPicker && (
        <Portal>
          <div className="fixed inset-0 z-40" onClick={handleToggle}></div>

          <div
            className="absolute bottom-0 z-50"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <Picker {...props} groupNames={EMOJI_GROUP} />
          </div>
        </Portal>
      )}
    </div>
  );
};

export default EmojiPicker;
