import { Button, useEditableControls } from "@chakra-ui/react";
import React from "react";
import "@fontsource/atkinson-hyperlegible";
import "../../styles/profilepage.css";
import { useTranslation } from "react-i18next";

export default function EditableControls() {
  const { t } = useTranslation();
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <div></div>
  ) : (
    <Button
      ml="4"
      color={"#393939"}
      textDecoration={"underline"}
      variant={"link"}
      fontSize={"lg"}
      {...getEditButtonProps()}
    >
      {t("Edit")}
    </Button>
  );
}
