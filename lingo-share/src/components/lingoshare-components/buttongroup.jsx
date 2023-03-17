import * as React from "react";
import { Stack } from "@chakra-ui/react";
import PrimaryButton from "./primarybutton";
import SecondaryButton from "./secondarybutton";
import TertiaryButton from "./tertiarybutton";

export default function ButtonGroup({
  buttonTypeList, // e.g. ["primary", "secondary", "tertiary"]
  textList, // e.g. ["text for btn1", "text for btn2", "text for btn3"]
  onClickList,
  isDisabledList,
  rightIconList,
  spacing,
  marginLeft,
  marginTop,
  width,
  height,
}) {
  console.log(isDisabledList);
  return (
    <Stack
      direction={"row"}
      spacing={spacing}
      align={"center"}
      marginTop={marginTop}
      marginLeft={marginLeft}
      className="heading"
    >
      {buttonTypeList.map((buttonType, i) => {
        let render = <div></div>;
        if (buttonType === "primary") {
          render = (
            <PrimaryButton
              width={width}
              height={height}
              onClick={onClickList ? onClickList[i] : () => {}}
              isDisabled={isDisabledList ? isDisabledList[i] : false}
              rightIcon={rightIconList && rightIconList[i]}
              text={textList[i]}
            />
          );
        } else if (buttonType === "secondary") {
          render = (
            <SecondaryButton
              width={width}
              height={height}
              onClick={onClickList ? onClickList[i] : () => {}}
              isDisabled={isDisabledList ? isDisabledList[i] : false}
              rightIcon={rightIconList && rightIconList[i]}
              text={textList[i]}
            />
          );
        } else {
          render = (
            <TertiaryButton
              onClick={onClickList && onClickList[i]}
              text={textList[i]}
            />
          );
        }
        return render;
      })}
    </Stack>
  );
}
