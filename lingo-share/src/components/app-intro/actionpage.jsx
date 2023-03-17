import * as React from "react";
import { ChakraProvider, Text } from "@chakra-ui/react";
import lingoImage from "./landing-page-resources/lightbulb.png";
import PrimaryButton from "../lingoshare-components/primarybutton";


export default function ActionPage({ t, handleNavigation }) {
  return (
    <div>
      <ChakraProvider>
        <div className="field-pg">
          <img
            height={"150px"}
            width={"150px"}
            src={lingoImage}
            alt="lingoshare talking"
          />
          <Text fontSize="xl" maxWidth={"400px"} marginTop={"30px"}>
            {t("Connect and form friendships by learning from one another!")}
          </Text>
          <PrimaryButton
            className="btn"
            width={"140px"}
            height={"50px"}
            marginTop={"50px"}
            text={t("Next")}
            onClick={() => handleNavigation("home")}
          />
        </div>
      </ChakraProvider>
    </div>
  );
}
