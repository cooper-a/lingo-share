import * as React from "react";
import { ChakraProvider, Button, Text } from "@chakra-ui/react";
import lingoImage from "./landing-page-resources/lightbulb.png";

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
          <Button
            className="btn"
            height={"50px"}
            marginTop={"50px"}
            onClick={() => handleNavigation("home")}
            variant="outline"
          >
            {t("Next")}
          </Button>
        </div>
      </ChakraProvider>
    </div>
  );
}
