import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { rtdb } from "../../firebase";
import { UserAuth } from "../../contexts/AuthContext";
import { Button, ButtonGroup, Text, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Icon from "@adeira/icons";
import "../../styles/controls.css";

const ControlButton = ({ text, iconName, onClick }) => {
  return (
    <div className="control-toggle" onClick={onClick}>
      <Icon name={iconName} width={"40px"} height={"40px"} />
      <Text>{text}</Text>
    </div>
  );
};

export default function Controls({
  handleCallDisconnect,
  handleAudioToggle,
  handleVideoToggle,
  handlePromptToggle,
  isPromptToggled,
  audio,
  video,
}) {
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const { user } = UserAuth();
  const targetUserRef = ref(rtdb, "users/" + user.uid);
  const { t, i18n } = useTranslation();

  const handleTranslate = (lang) => {
    console.log("translate");
    i18n.changeLanguage(lang);
    if (user === null || Object.keys(user).length === 0) return;
    const languageRef = ref(rtdb, `users/${user.uid}/language`);
    set(languageRef, lang);
    // console.log(currPage);
    // navigate(currPage);
  };

  useEffect(() => {
    onValue(targetUserRef, (snapshot) => {
      let snapshotVal = snapshot.val();
      setPreferredLanguage(snapshotVal.language);
    });
  }, []);

  return (
    <div className="control-btns">
      <div className="topic-btn">
        <ControlButton
          onClick={handlePromptToggle}
          text={t("Choose a Topic")}
          iconName={"thread"}
        />
      </div>
      <ButtonGroup className="track-btns">
        <ControlButton
          text={video ? t("Turn off Camera") : t("Turn on Camera")}
          iconName={video ? "camera_alt" : "camera_noflash_alt"}
          onClick={handleVideoToggle}
        />
        <ControlButton
          text={audio ? t("Turn off Mic") : t("Turn on Mic")}
          iconName={audio ? "microphone" : "microphone_disabled"}
          onClick={handleAudioToggle}
        />
      </ButtonGroup>

      <ButtonGroup className="options-btns">
        <ControlButton
          text={preferredLanguage === "en" ? "English" : "中文"}
          iconName={"translate"}
          onClick={() =>
            handleTranslate(preferredLanguage === "en" ? "zh" : "en")
          }
        />
        <ControlButton
          text={"Text Size"}
          iconName={"zoom_in"}
          // onClick={} // TODO: make this functional
        />
      </ButtonGroup>
      <div className="leave-btn">
        <Button onClick={handleCallDisconnect}>
          <Text fontSize={"1rem"} fontFamily={"Inter"}>
            {t("Leave Call")}
          </Text>
        </Button>
      </div>
    </div>
  );
}
