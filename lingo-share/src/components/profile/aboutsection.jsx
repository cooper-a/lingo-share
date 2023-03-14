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
import { useTranslation } from "react-i18next";

export default function AboutSection({ setBio, isPrimaryUser, bio }) {
  const { t } = useTranslation();
  return (
    <div className="about-section">
      <div className="sub-heading">
        <Text
          float={"left"}
          marginBottom={"10px"}
          fontSize="3xl"
          fontWeight={"bold"}
        >
          {t("About")}
          {isPrimaryUser && <Icon className="editable" name="pen" />}
        </Text>
      </div>
      <div className="about-text">
        {isPrimaryUser ? (
          <Editable
            value={bio ? bio : t("Click here to enter a bio about yourself...")}
            fontSize={"xl"}
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
