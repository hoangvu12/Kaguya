import { Picker, PickerProps } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { usePopper } from "react-popper";
import Portal from "./Portal";

interface EmojiPickerProps extends PickerProps {}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ ...props }) => {
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
    placement: "top",
  });

  const handleToggle = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div className="relative">
      <button
        ref={setReferenceElement}
        onClick={handleToggle}
        className="p-2 transition duration-300 rounded-full hover:bg-white/20"
      >
        <BsEmojiSmile className="w-6 h-6" />
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
