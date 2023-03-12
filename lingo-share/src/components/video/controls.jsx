import React from "react";
import { Button, ButtonGroup, Text, Tooltip } from "@chakra-ui/react";
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
  handleTranslate,
  preferredLanguage,
  translator,
  isPromptToggled,
  audio,
  video,
}) {
  return (
    <div className="control-btns">
      <div className="topic-btn">
        <ControlButton
          onClick={handlePromptToggle}
          text={translator("Choose a Topic")}
          iconName={"thread"}
        />
      </div>
      <ButtonGroup className="track-btns">
        <ControlButton
          text={
            video ? translator("Turn off Camera") : translator("Turn on Camera")
          }
          iconName={video ? "camera_alt" : "camera_noflash_alt"}
          onClick={handleVideoToggle}
        />
        <ControlButton
          text={audio ? translator("Turn off Mic") : translator("Turn on Mic")}
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
            {translator("Leave Call")}
          </Text>
        </Button>
      </div>
    </div>
  );
}
