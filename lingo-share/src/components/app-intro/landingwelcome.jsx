import * as React from "react";
import { ChakraProvider, Text } from "@chakra-ui/react";
import PrimaryButton from "../lingoshare-components/primarybutton";

export default function LandingWelcome({ t, handleStepChange }) {
  return (
    <div>
      <ChakraProvider>
        <div className="welcome-pg">
          <Text className="font" fontSize="5xl">
            {t("Welcome to LingoShare!")}
          </Text>
          <PrimaryButton
            className="btn"
            width={"140px"}
            height={"50px"}
            marginTop={"50px"}
            text={t("Next")}
            onClick={() => handleStepChange("showDescription")}
          />
        </div>
      </ChakraProvider>
    </div>
  );
}
