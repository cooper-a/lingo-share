import * as React from "react";
import { Input, InputGroup, Text } from "@chakra-ui/react";

export default function PasswordInput({ onChange, isInvalid, error }) {
  return (
    <div>
      <InputGroup size="md" width={"300px"}>
        <Input
          isInvalid={isInvalid}
          height={"50px"}
          marginTop={"50px"}
          onChange={onChange}
          placeholder="Email"
          width={"300px"}
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
