import * as React from "react";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";

export default function PasswordInput({ onChange, isInvalid, error }) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <div>
      <InputGroup size="md" width={"300px"}>
        <Input
          isInvalid={isInvalid}
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          onChange={onChange}
          height={"50px"}
        />
        <InputRightElement width="4.5rem" paddingTop="10px">
          <Button h="2.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      {isInvalid && (
        <Text paddingTop={"5px"} color={"crimson"} fontSize="sm">
          {error}
        </Text>
      )}
    </div>
  );
}
