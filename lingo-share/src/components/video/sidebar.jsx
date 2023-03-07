import {
  Box,
  Button,
  CloseButton,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import Icon from "@adeira/icons";
import { rtdb } from "../../firebase";
import { ref, set } from "firebase/database";
import "../../styles/room.css";

const NavItem = ({ topicName, onClick }) => {
  return (
    <div className="inner-topic-btn" onClick={onClick}>
      <Button
        className="topic-btn-clickable"
        width={"300px"}
        height={"50px"}
        variant={"unstyled"}
        bgColor={"white"}
        onClick={onClick}
        rightIcon={<ChevronRightIcon alignContent={"right"} />}
      >
        {topicName}
      </Button>
    </div>
  );
};

export default function Sidebar({ prompts, handlePromptSelect }) {
  const [displayList, setDisplayList] = useState([]);

  useEffect(() => {
    setDisplayList(Object.keys(prompts));
  }, [prompts]);

  return (
    <div>
      <Box
        className="sidebar"
        borderRight="1px"
        left={"10px"}
        top={"10px"}
        bottom={"110px"}
        position={"fixed"}
        w="375px"
      >
        <div className="title-sidebar">
          <Text as={"b"} fontSize="xl" fontFamily={"Inter"}>
            Choose a Topic
          </Text>
        </div>
        <div className="title-description">
          <Text>What do you want to talk about</Text>
        </div>
        <Flex
          paddingTop={"2rem"}
          paddingLeft={"1rem"}
          paddingBottom={"0.5rem"}
          justifyContent="space-between"
          direction={"column"}
        >
          {displayList.map((promptName, i) => (
            <NavItem
              key={i}
              onClick={() => handlePromptSelect(promptName)}
              topicName={promptName}
            />
          ))}
        </Flex>
      </Box>
    </div>
  );
}
