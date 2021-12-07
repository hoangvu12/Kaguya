import { customEmojis } from "@/utils/emoji";
import { Placement } from "@popperjs/core";
import { Picker, PickerProps } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import React, { useState } from "react";
import { usePopper } from "react-popper";
import Portal from "./Portal";

interface EmojiPickerProps extends PickerProps {
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
            <Picker
              {...props}
              showSkinTones={false}
              set="facebook"
              custom={customEmojis}
              emoji="grinning"
              color="#EF4444"
              title="Kaguya"
              i18n={{
                search: "Tìm kiếm",
                notfound: "Không tìm thấy biểu cảm.",
                categories: {
                  search: "Kết quả tìm kiếm",
                  recent: "Dùng gần đây",
                  people: "Con người",
                  nature: "Tự nhiên",
                  foods: "Đồ ăn và nước uống",
                  activity: "Hoạt động",
                  places: "Du lịch",
                  objects: "Đối tượng",
                  symbols: "Biểu tượng",
                  flags: "Cờ",
                  custom: "Kaguya",
                },
              }}
              theme="dark"
              include={[
                "recent",
                "custom",
                "people",
                "nature",
                "foods",
                "activity",
                "places",
                "objects",
                "symbols",
                "flags",
              ]}
            />
          </div>
        </Portal>
      )}
    </div>
  );
};

export default EmojiPicker;
