import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
        {displayList.map((link, i) => (
          <NavItem onClick={handlePromptSelect} topicName={link} />
        ))}
      </Box>
    </div>
  );
}
