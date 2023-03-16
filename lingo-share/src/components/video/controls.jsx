import React from "react";
import {
  Button,
  ButtonGroup,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";
import Icon from "@adeira/icons";
import "../../styles/controls.css";
import { t } from "i18next";

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
  handleLeaveToggle,
  handleTranslate,
  preferredLanguage,
  translator,
  isPromptToggled,
  isOpen,
  onClose,
  audio,
  video,
}) {
  return (
    <div className="control-btns">
      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        placement="top"
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <div className="topic-btn">
            <ControlButton
              onClick={handlePromptToggle}
              text={translator("Choose a Topic")}
              iconName={"thread"}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          margin="12px"
          padding={"2px"}
          bg={"#363636"}
          color="white"
        >
          <PopoverArrow bg={"#363636"} />
          <PopoverCloseButton />
          <PopoverBody>
            {t("Find something to talk about by choosing a topic!")}
          </PopoverBody>
        </PopoverContent>
      </Popover>
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

      <div className="leave-btn">
        <ButtonGroup className="options-btns">
          <ControlButton
            text={preferredLanguage === "en" ? "English" : "中文"}
            iconName={"translate"}
            onClick={() =>
              handleTranslate(preferredLanguage === "en" ? "zh" : "en")
            }
          />
        </ButtonGroup>
        <Button
          marginTop={"15px"}
          bgColor={"white"}
          onClick={handleLeaveToggle}
        >
          <Text margin={"5px"} fontSize={"1rem"} fontFamily={"Inter"}>
            {translator("Leave Call")}
          </Text>
        </Button>
      </div>
    </div>
  );
}
