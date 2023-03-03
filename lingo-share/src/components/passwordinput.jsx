import * as React from "react";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function PasswordInput({ onChange, isInvalid, error, width }) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const { t } = useTranslation();

  return (
    <div>
      <InputGroup size="md" width={width}>
        <Input
          isInvalid={isInvalid}
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder={t("Enter password")}
          onChange={onChange}
          height={"50px"}
        />
        <InputRightElement width="4.5rem" paddingTop="10px">
          <Button h="2.75rem" size="sm" onClick={handleClick}>
            {show ? t("Hide") : t("Show")}
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
