import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { rtdb } from "../../firebase";
import { ref, set } from "firebase/database";
import "../../styles/room.css";

const NavItem = ({ topicName, onClick }) => {
  return (
    <Flex
      onClick={onClick}
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "gray.200",
        color: "black",
      }}
    >
      {topicName}
    </Flex>
  );
};

export default function Sidebar({ prompts, handlePromptSelect }) {
  const [displayList, setDisplayList] = useState([]);

  const live_prompt_ref = ref(rtdb, "/live_prompts/");

  const handlePromptSelection = (prompt) => {
    console.log(prompt);
    set(live_prompt_ref, prompt);
  };

  useEffect(() => {
    setDisplayList(Object.keys(prompts));
  }, [prompts]);

  return (
    <div>
      <Box
        className="sidebar"
        bg={"gray.100"}
        borderRight="1px"
        borderRightColor={"gray.200"}
        top={"0px"}
        bottom={"60px"}
        position={"fixed"}
        w="275px"
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="Inter" fontWeight="bold">
            Topics
          </Text>
        </Flex>
        {displayList.map((promptName, i) => (
          <NavItem
            key={i}
            onClick={() => handlePromptSelection(promptName)}
            topicName={promptName}
          />
        ))}
      </Box>
    </div>
  );
}
