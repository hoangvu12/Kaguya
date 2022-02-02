import { SKIP_TIME } from "@/constants";
import React, { useState } from "react";
import { CgShortcut } from "react-icons/cg";
import Kbd from "@/components/shared/Kbd";
import Popup from "@/components/shared/Popup";
import Portal from "@/components/shared/Portal";
import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";

const shortcuts = [
  {
    key: "Space/K",
    func: "Chạy/Dừng video",
  },
  {
    key: "M",
    func: "Tắt/Bật âm lượng",
  },
  {
    key: ">",
    func: "Tiến tới 10 giây",
  },
  {
    key: "<",
    func: "Tiến lùi 10 giây",
  },
  {
    key: "Shift + N",
    func: "Sang tập tiếp theo",
  },
  {
    key: "Shift + >",
    func: `Skip OP/ED (${SKIP_TIME} giây)`,
  },
  {
    key: "F",
    func: "Toàn màn hình",
  },
];

const ShortcutsPanel = () => {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <React.Fragment>
      <Popup
        placement="top"
        referenceClassName="w-8 h-8"
        portalSelector=".video-wrapper"
        reference={
          <ControlsIcon
            Icon={CgShortcut}
            onClick={() => setShowPanel(true)}
          ></ControlsIcon>
        }
      >
        <p className="rounded-sm">Bảng phím tắt</p>
      </Popup>

      {showPanel && (
        <Portal selector=".video-wrapper">
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setShowPanel(false)}
          />

          <div className="p-8 fixed z-[9999] flex top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md w-4/6 h-5/6 bg-background-900">
            <table className="w-full">
              <thead>
                <tr>
                  <th align="left">Phím tắt</th>
                  <th align="left">Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {shortcuts.map(({ key, func }, index) => (
                  <tr key={index}>
                    <td>
                      <Kbd>{key}</Kbd>
                    </td>

                    <td>{func}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default ShortcutsPanel;
