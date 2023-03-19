import * as React from "react";
import { Button } from "@chakra-ui/react";

export default function PrimaryButton({
  onClick,
  align,
  direction,
  isDisabled = false,
  size,
  text,
  width,
  height,
  marginTop,
  marginLeft,
  marginRight,
  outlineColor,
  borderWidth,
}) {
  return (
    <Button
      className="font"
      bgColor={"#363636"}
      _hover={{ bgColor: "#7d7c7c" }}
      align={align}
      color={"white"}
      direction={direction}
      isDisabled={isDisabled}
      marginTop={marginTop}
      marginLeft={marginLeft}
      marginRight={marginRight}
      width={width}
      borderRadius={"xl"}
      height={height}
      onClick={onClick}
      size={size}
      borderColor={outlineColor}
      borderWidth={borderWidth}
    >
      {text}
    </Button>
  );
}
