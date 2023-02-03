import * as React from "react";
import { Input } from "@chakra-ui/react";
import { InputGroup, InputRightElement } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export default function PasswordInput({ onChange }) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md" width={"300px"}>
      <Input
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
  );
}
