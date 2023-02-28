import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import "../../styles/room.css";

const NavItem = ({ topicName }) => {
  return (
    <Flex
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

export default function Sidebar({ prompts }) {
  const [displayList, setDisplayList] = useState(["Test1, Test2, Test3"]);

  console.log(prompts);

  const changeDisplayList = (clicked) => {
    console.log(clicked);
  };

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
        w="210px"
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="Inter" fontWeight="bold">
            Topics
          </Text>
        </Flex>
        {displayList.map((link) => (
          <NavItem onClick={changeDisplayList(link)} topicName={link} />
        ))}
      </Box>
    </div>
  );
}
