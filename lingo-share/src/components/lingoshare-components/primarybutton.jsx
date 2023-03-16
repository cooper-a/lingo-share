import * as React from "react";
import { Button } from "@chakra-ui/react";

export default function PrimaryButton({
  onClick,
  align,
  direction,
  isDisabled,
  size,
  text,
  width,
  height,
  rightIcon,
  marginTop,
  marginLeft,
  marginRight,
}) {
  return (
    <Button
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
      rightIcon={rightIcon}
      height={height}
      onClick={onClick}
      size={size}
    >
      {text}
    </Button>
  );
}
