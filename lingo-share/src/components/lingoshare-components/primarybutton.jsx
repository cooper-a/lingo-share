import * as React from "react";
import { Button } from "@chakra-ui/react";

export default function PrimaryButton({
  onClick,
  isDisabled,
  text,
  width,
  height,
  marginTop,
  marginLeft,
  marginRight,
}) {
  return (
    <Button
      bgColor={"#363636"}
      _hover={{ bgColor: "#7d7c7c" }}
      color={"white"}
      isDisabled={isDisabled}
      marginTop={marginTop}
      marginLeft={marginLeft}
      marginRight={marginRight}
      width={width}
      borderRadius={"xl"}
      height={height}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
