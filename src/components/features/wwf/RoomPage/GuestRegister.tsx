import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Modal, { ModalRef } from "@/components/shared/Modal";
import { useTranslation } from "next-i18next";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

interface GuestRegisterProps {
  onRegister?: (name: string) => void;
}

const GuestRegister: React.FC<GuestRegisterProps> = ({ onRegister }) => {
  const modalRef = useRef<ModalRef>(null);
  const { t } = useTranslation("wwf");
  const [name, setName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleRegister = () => {
    if (!name) {
      toast.error(t("guest_register.name_required"));

      return;
    }

    onRegister?.(name);
  };

  return (
    <Modal
      className="md:w-1/3 w-11/12"
      defaultValue={true}
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <h1 className="text-2xl font-semibold mb-1">
        {t("guest_register.title")}
      </h1>

      <p className="text-lg mb-4">{t("guest_register.description")}</p>

      <Input
        onChange={handleInputChange}
        placeholder={t("guest_register.name_placeholder")}
        containerClassName="mb-8"
        className="px-2 py-3"
      />

      <Button onClick={handleRegister} primary>
        {t("guest_register.register")}
      </Button>
    </Modal>
  );
};

export default GuestRegister;
