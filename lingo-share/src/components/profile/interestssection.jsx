import {
  Button,
  Input,
  InputRightElement,
  Text,
  InputGroup,
} from "@chakra-ui/react";
import React from "react";
import Icon from "@adeira/icons";
import "../../styles/profilepage.css";
import { useState } from "react";

export default function InterestsSection({
  isPrimaryUser,
  setIsEditingInterests,
  isEditingInterests,
  onAddInterest,
}) {
  const [currentInterest, setCurrentInterest] = useState("");

  const handleAddInterest = () => {
    onAddInterest(currentInterest);
    setCurrentInterest("");
  };

  return (
    <div className="font">
      <Text
        float={"left"}
        marginTop={"2rem"}
        marginBottom={"20px"}
        fontSize={"3xl"}
        fontWeight={"bold"}
      >
        {"Interests"}
        {isPrimaryUser && (
          <Icon
            onClick={setIsEditingInterests}
            className="edit-icon"
            name="pen"
          />
        )}
      </Text>
      {isEditingInterests && (
        <InputGroup>
          <Input
            marginBottom={"20px"}
            variant="flushed"
            placeholder="Add an interest"
            value={currentInterest}
            onChange={(e) => setCurrentInterest(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleAddInterest}>
              Add
            </Button>
          </InputRightElement>
        </InputGroup>
      )}
    </div>
  );
}
