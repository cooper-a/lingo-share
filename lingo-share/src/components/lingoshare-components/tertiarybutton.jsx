import * as React from "react";
import { Button } from "@chakra-ui/react";

export default function TertiaryButton({
  className,
  align,
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
      align={align}
      variant={"link"}
      className={className}
      color={"#363636"}
      isDisabled={isDisabled}
      marginTop={marginTop}
      marginLeft={marginLeft}
      marginRight={marginRight}
      width={width}
      height={height}
      onClick={onClick}
      textDecoration={"underline"}
    >
      {text}
    </Button>
  );
}
