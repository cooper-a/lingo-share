import React from "react";
import { Button } from "@chakra-ui/react";

const Controls = ({
  handleCallDisconnect,
  handleAudioToggle,
  handleVideoToggle,
  audio,
  video,
}) => {
  return (
    <>
      <Button onClick={handleAudioToggle}>Mute On/Off</Button>
      <Button endCall onClick={handleCallDisconnect}>
        End Call
      </Button>
      <Button onClick={handleVideoToggle}>Video On/Off</Button>
    </>
  );
};

export default Controls;
