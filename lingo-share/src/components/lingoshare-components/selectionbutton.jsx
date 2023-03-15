import * as React from "react";
import { Button } from "@chakra-ui/react";

export default function SelectionButton({ isSelected, onClick, text }) {
  return (
    <Button
      borderRadius={"full"}
      variant={"outline"}
      className="feedback-btn"
      bgColor={isSelected ? "#393939" : "white"}
      color={isSelected ? "white" : "#393939"}
      _hover={{ _placeholder: { color: "#393939" } }}
      borderWidth={"1.5px"}
      width={"120px"}
      h="2.75rem"
      size="lg"
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
