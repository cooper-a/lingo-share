import * as React from "react";
import { ChakraProvider, Button, Text } from "@chakra-ui/react";
import lingoImage from "./landing-page-resources/talkingpeople.png";

export default function DescriptionPage({ t, handleStepChange }) {
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
            {t(
              "LingoShare is a place where you can meet Mandarin speakers and learners!"
            )}
          </Text>
          <Button
            className="btn"
            height={"50px"}
            marginTop={"50px"}
            onClick={() => handleStepChange("showAction")}
            variant="outline"
          >
            {t("Next")}
          </Button>
        </div>
      </ChakraProvider>
    </div>
  );
}
