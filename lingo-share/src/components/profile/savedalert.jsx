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

export default function SavedAlert({ onClose }) {
  return (
    <div>
      <Alert margin="0px" width={"100vh"} status="success">
        <AlertIcon />
        <Box width={"100vh"}>
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your profile changes were saved</AlertDescription>
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
