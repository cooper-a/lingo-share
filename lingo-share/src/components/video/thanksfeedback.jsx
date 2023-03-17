import { Text } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../../styles/feedback.css";
import PrimaryButton from "../lingoshare-components/primarybutton";
import Navbar from "../navbar";

export default function ThanksFeedback() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = (path) => {
    navigate("/" + path);
  };

  return (
    <div>
      <Navbar currPage="/thanksfeedback" />
      <div className="welcome-pg">
        <Text fontSize="4xl">{t("Thanks for your feedback!")}</Text>
        <PrimaryButton
          width={"400px"}
          height={"50px"}
          marginTop={"50px"}
          variant="outline"
          onClick={() => handleClick("dashboard")}
          text={t("Back to LingoShare")}
        />
      </div>
    </div>
  );
}
