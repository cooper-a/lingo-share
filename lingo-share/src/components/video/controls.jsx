import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, CloseButton, Tooltip } from "@chakra-ui/react";
import "../../styles/controls.css";

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
      <div class="topic-btn">
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
            <Button onClick={handlePromptToggle}>Topics</Button>
          </Tooltip>
        ) : (
          <div className="close-btn">
            <CloseButton
              onClick={handlePromptToggle}
              bgColor={"gray.100"}
              size="lg"
            />
          </div>
        )}
      </div>
      <ButtonGroup className="track-btns">
        <Button onClick={handleVideoToggle}>Camera</Button>
        <Button marginLeft={"10px"} onClick={handleAudioToggle}>
          Mic
        </Button>
      </ButtonGroup>
      <div className="leave-btn">
        <Button onClick={handleCallDisconnect}>Leave</Button>
      </div>
    </div>
  );
}
