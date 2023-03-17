import { Button, useEditableControls } from "@chakra-ui/react";
import React from "react";
import "@fontsource/atkinson-hyperlegible";
import "../../styles/profilepage.css";

export default function EditableControls() {
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
      Edit
    </Button>
  );
}
