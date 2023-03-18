import * as React from "react";
import { ChakraProvider, Text } from "@chakra-ui/react";
import PrimaryButton from "../lingoshare-components/primarybutton";

export default function LandingWelcome({ t, handleNavigation }) {
  return (
    <div>
      <ChakraProvider>
        <div className="welcome-pg">
          <Text className="font" fontSize="4xl">
            {t("First, we need to get you set up!")}
          </Text>
          <PrimaryButton
            className="btn"
            width={"180px"}
            height={"50px"}
            marginTop={"50px"}
            text={t("Begin Setup")}
            onClick={() => handleNavigation("userselect")}
          />
        </div>
      </ChakraProvider>
    </div>
  );
}
