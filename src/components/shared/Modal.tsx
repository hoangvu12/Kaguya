import classNames from "classnames";
import React, { PropsWithChildren, useImperativeHandle, useState } from "react";
import { CgClose } from "react-icons/cg";
import CircleButton from "./CircleButton";
import Portal from "./Portal";

export interface ModalProps {
  reference: React.ReactNode;
  className?: string;
}

export interface ModalRef {
  open: () => void;
  close: () => void;
}

const Modal = React.forwardRef<ModalRef, PropsWithChildren<ModalProps>>(
  ({ reference, children, className = "" }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    let defaultClassName =
      "fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-50 p-8 rounded-md bg-background-900";

    if (className.includes("w-")) {
      defaultClassName = classNames(defaultClassName, className);
    } else {
      defaultClassName = classNames(defaultClassName, "w-11/12 md:w-2/3");
    }

    const handleOpenState = (value: boolean) => () => {
      setIsOpen(value);
    };

    useImperativeHandle(
      ref,
      () => ({
        open: handleOpenState(true),
        close: handleOpenState(false),
      }),
      []
    );

    return (
      <React.Fragment>
        <div onClick={handleOpenState(true)}>{reference}</div>

        <Portal>
          {isOpen && (
            <React.Fragment>
              <div
                className="fixed inset-0 z-40 bg-black/70"
                onClick={handleOpenState(false)}
              />

              <div className={defaultClassName}>
                {children}

                <CircleButton
                  className="absolute top-2 right-2"
                  secondary
                  LeftIcon={CgClose}
                  onClick={handleOpenState(false)}
                />
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
