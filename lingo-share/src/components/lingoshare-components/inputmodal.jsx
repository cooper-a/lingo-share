import * as React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalBody,
  Textarea,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SecondaryButton from "./secondarybutton";
import TertiaryButton from "./tertiarybutton";

export default function InputModal({
  isOpen,
  onClose,
  inputPrompt,
  onSubmitInput,
  text,
  setText,
}) {
  const { t } = useTranslation();
  return (
    <div>
      <Modal onClose={onClose} size={"md"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent borderRadius={"2xl"}>
          <ModalHeader marginTop={"1rem"} className="font" alignSelf={"center"}>
            {inputPrompt}
          </ModalHeader>
          <ModalBody>
            <Textarea onChange={(e) => setText(e.target.value)} />
          </ModalBody>
          <ModalFooter
            gap={"20px"}
            marginBottom={"1.5rem"}
            alignSelf={"center"}
          >
            <SecondaryButton
              text={t("Block User")}
              onClick={onSubmitInput}
              marginleft={"15px"}
              width={"150px"}
            />
            <TertiaryButton text={t("Cancel")} onClick={onClose} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
