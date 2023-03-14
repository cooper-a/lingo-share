import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  CloseButton,
  Box,
} from "@chakra-ui/react";
import React from "react";
import "@fontsource/atkinson-hyperlegible";
import "../../styles/profilepage.css";
import { useTranslation } from "react-i18next";

export default function SavedAlert({ onClose, text }) {
  const { t } = useTranslation();
  return (
    <div>
      <Alert margin="0px" width={"100vh"} status="success">
        <AlertIcon />
        <Box width={"100vh"}>
          <AlertTitle>{t("Success!")}</AlertTitle>
          <AlertDescription>{text}</AlertDescription>
        </Box>
        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          top={-1}
          onClick={onClose}
        />
      </Alert>
    </div>
  );
}
