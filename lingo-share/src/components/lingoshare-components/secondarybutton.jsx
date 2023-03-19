import * as React from "react";
import { Button } from "@chakra-ui/react";

export default function SecondaryButton({
  onClick,
  align,
  isDisabled,
  text,
  width,
  height,
  marginTop,
  marginLeft,
  marginRight,
  marginBottom,
  rightIcon,
  size,
}) {
  return (
    <Button
      align={align}
      borderWidth={"1.5px"}
      borderColor={"#393939"}
      bgColor={"white"}
      color={"#363636"}
      isDisabled={isDisabled}
      marginTop={marginTop}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginBottom={marginBottom}
      width={width}
      borderRadius={"xl"}
      height={height}
      onClick={onClick}
      rightIcon={rightIcon}
      size={size}
      className="font"
    >
      {text}
    </Button>
  );
}
