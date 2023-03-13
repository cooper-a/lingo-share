import {
  Editable,
  EditablePreview,
  EditableTextarea,
  Text,
} from "@chakra-ui/react";
import "@fontsource/atkinson-hyperlegible";
import React from "react";
import Icon from "@adeira/icons";
import "../../styles/profilepage.css";

export default function AboutSection({ setBio, isPrimaryUser, bio }) {
  return (
    <div className="about-section">
      <div className="sub-heading">
        <Text
          float={"left"}
          marginBottom={"10px"}
          fontSize="3xl"
          fontWeight={"bold"}
        >
          {"About"}
          {isPrimaryUser && <Icon className="editable" name="pen" />}
        </Text>
      </div>
      <div className="about-text">
        {isPrimaryUser ? (
          <Editable
            defaultValue={
              bio ? bio : "Click here to enter a bio about yourself..."
            }
          >
            <EditablePreview />
            <EditableTextarea
              width={"100vh"}
              onChange={(e) => setBio(e.target.value)}
            />
          </Editable>
        ) : (
          <Text fontSize={"xl"}>{bio}</Text>
        )}
      </div>
    </div>
  );
}
