import * as React from "react";
import { Button } from "@chakra-ui/react";

export default function SecondaryButton({
  onClick,
  isDisabled,
  text,
  width,
  height,
  marginTop,
  marginLeft,
  marginRight,
  size,
}) {
  return (
    <Button
      borderWidth={"1.5px"}
      borderColor={"#393939"}
      bgColor={"white"}
      color={"#363636"}
      isDisabled={isDisabled}
      marginTop={marginTop}
      marginLeft={marginLeft}
      marginRight={marginRight}
      width={width}
      borderRadius={"xl"}
      height={height}
      onClick={onClick}
      size={size}
    >
      {text}
    </Button>
  );
}
