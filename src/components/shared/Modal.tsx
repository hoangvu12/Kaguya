import classNames from "classnames";
import React, {
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { CgClose } from "react-icons/cg";
import CircleButton from "./CircleButton";
import Portal from "./Portal";

export interface ModalProps {
  reference?: React.ReactNode;
  className?: string;
  closeOnClickOutside?: boolean;
  defaultValue?: boolean;
  onClose?: () => void;
  portalSelector?: string;
}

export interface ModalRef {
  open: () => void;
  close: () => void;
}

const Modal = React.forwardRef<ModalRef, PropsWithChildren<ModalProps>>(
  (
    {
      reference,
      children,
      className = "",
      closeOnClickOutside = true,
      defaultValue = false,
      onClose,
      portalSelector,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(defaultValue);

    let defaultClassName =
      "fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-[9999] p-8 rounded-md bg-background-900 max-h-[80vh] overflow-y-auto no-scrollbar";

    if (className.includes("w-")) {
      defaultClassName = classNames(defaultClassName, className);
    } else {
      defaultClassName = classNames(defaultClassName, "w-11/12 md:w-2/3");
    }

    const handleOpenState = useCallback(
      (value: boolean) => () => {
        if (!value) {
          onClose?.();
        }

        setIsOpen(value);
      },
      [onClose]
    );

    useImperativeHandle(
      ref,
      () => ({
        open: handleOpenState(true),
        close: handleOpenState(false),
      }),
      [handleOpenState]
    );

    return (
      <React.Fragment>
        <div onClick={handleOpenState(true)}>{reference}</div>

        <Portal selector={portalSelector}>
          {isOpen && (
            <React.Fragment>
              {closeOnClickOutside && (
                <div
                  className="fixed inset-0 z-50 bg-black/70"
                  onClick={handleOpenState(false)}
                />
              )}

              <div className={defaultClassName}>
                {children}

                {closeOnClickOutside && (
                  <CircleButton
                    className="absolute top-2 right-2"
                    secondary
                    LeftIcon={CgClose}
                    onClick={handleOpenState(false)}
                  />
                )}
              </div>
            </React.Fragment>
          )}
        </Portal>
      </React.Fragment>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
