import * as React from "react";
import { Button } from "@chakra-ui/react";

export default function PrimaryButton({ onClick, text }) {
  return (
    <Button
      className="btn"
      bgColor={"#393939"}
      _hover={{ _placeholder: { color: "#393939" } }}
      color={"white"}
      marginTop={"2rem"}
      width={"200px"}
      borderRadius={"lg"}
      height={"45px"}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
