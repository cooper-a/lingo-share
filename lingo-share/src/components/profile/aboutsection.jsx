import {
  Editable,
  EditablePreview,
  EditableTextarea,
  Text,
} from "@chakra-ui/react";
import "@fontsource/atkinson-hyperlegible";
import React from "react";
import "../../styles/profilepage.css";
import { useTranslation } from "react-i18next";
import EditableControls from "./editablecontrols";

export default function AboutSection({ setBio, isPrimaryUser, bio }) {
  const { t } = useTranslation();

  let aboutRender = (
    <div className="sub-heading">
      <Text
        float={"left"}
        marginBottom={"10px"}
        fontSize="3xl"
        fontWeight={"bold"}
      >
        {t("About")}
        {isPrimaryUser && <EditableControls />}
      </Text>
    </div>
  );

  return (
    <div className="about-section">
      {!isPrimaryUser && aboutRender}
      <div className="about-text">
        {isPrimaryUser ? (
          <Editable
            value={bio ? bio : t("Click here to enter a bio about yourself...")}
            fontSize={"xl"}
          >
            {aboutRender}
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
