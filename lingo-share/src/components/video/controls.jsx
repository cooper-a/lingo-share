import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Text, Tooltip } from "@chakra-ui/react";
import Icon from "@adeira/icons";
import "../../styles/controls.css";

const ControlButton = ({ text, iconName, onClick }) => {
  return (
    <div className="control-toggle" marginLeft={"10px"} onClick={onClick}>
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
  return (
    <div className="control-btns">
      <div className="topic-btn">
        {!isPromptToggled ? (
          <Tooltip
            className="tooltip"
            hasArrow
            label="Continue the conversation
by selecting a topic!"
            bg="gray.700"
            fontSize={"l"}
            color="white"
            placement="top-end"
          >
            <ControlButton
              onClick={handlePromptToggle}
              text={"Choose a Topic"}
              iconName={"thread"}
            />
          </Tooltip>
        ) : (
          <ControlButton
            onClick={handlePromptToggle}
            text={"Choose a Topic"}
            iconName={"thread"}
          />
        )}
      </div>
      <ButtonGroup className="track-btns">
        {video ? (
          <div>
            <ControlButton
              text={"Turn off Camera"}
              iconName={"camera_alt"}
              onClick={handleVideoToggle}
            />
          </div>
        ) : (
          <ControlButton
            text={"Turn on Camera"}
            iconName={"camera_noflash_alt"}
            onClick={handleVideoToggle}
          />
        )}
        {audio ? (
          <ControlButton
            text={"Turn off Mic"}
            iconName={"microphone"}
            onClick={handleAudioToggle}
          />
        ) : (
          <ControlButton
            text={"Turn on Mic"}
            iconName={"microphone_disabled"}
            onClick={handleAudioToggle}
          />
        )}
      </ButtonGroup>
      <div className="leave-btn">
        <Button onClick={handleCallDisconnect}>
          <Text fontSize={"1rem"} fontFamily={"Inter"}>
            Leave Call
          </Text>
        </Button>
      </div>
    </div>
  );
}
