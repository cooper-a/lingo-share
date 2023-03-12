import * as React from "react";
import { ChakraProvider, Button, Text } from "@chakra-ui/react";

export default function LandingWelcome({ t, handleStepChange }) {
  return (
    <div>
      <ChakraProvider>
        <div className="welcome-pg">
          <Text fontSize="5xl">{t("Welcome to LingoShare!")}</Text>
          <Button
            className="btn"
            height={"50px"}
            marginTop={"50px"}
            onClick={() => handleStepChange("showDescription")}
            variant="outline"
          >
            {t("Next")}
          </Button>
        </div>
      </ChakraProvider>
    </div>
  );
}
