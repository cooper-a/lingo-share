import React from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import "../../styles/controls.css";

const Controls = ({
  handleCallDisconnect,
  handleAudioToggle,
  handleVideoToggle,
  audio,
  video,
}) => {
  return (
    <div className="control-btns">
      <div class="topic-btn">
        <Button>Topics</Button>
      </div>
      <ButtonGroup className="track-btns">
        <Button onClick={handleVideoToggle}>Camera</Button>
        <Button marginLeft={"10px"} onClick={handleAudioToggle}>
          Mic
        </Button>
      </ButtonGroup>
      <div className="leave-btn">
        <Button endCall onClick={handleCallDisconnect}>
          Leave
        </Button>
      </div>
    </div>
  );
};

export default Controls;
