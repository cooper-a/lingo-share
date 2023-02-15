import * as React from "react";
import { Input, InputGroup, Text } from "@chakra-ui/react";

export default function CustomInput({
  onChange,
  isInvalid,
  error,
  groupSize,
  marginTop,
  placeholder,
  width,
  height,
}) {
  return (
    <div>
      <InputGroup size="md" width={groupSize}>
        <Input
          isInvalid={isInvalid}
          height={height}
          marginTop={marginTop}
          onChange={onChange}
          placeholder={placeholder}
          width={width}
        />
      </InputGroup>
      {isInvalid && (
        <Text paddingTop={"5px"} color={"crimson"} fontSize="sm">
          {error}
        </Text>
      )}
    </div>
  );
}
