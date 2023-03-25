import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import "../../styles/room.css";
import { useTranslation } from "react-i18next";

const NavItem = ({ topicName, onClick }) => {
  const { t } = useTranslation();
  return (
    <div className="inner-topic-btn" onClick={onClick}>
      <Button
        className="topic-btn-clickable"
        width={"300px"}
        height={"50px"}
        variant={"unstyled"}
        bgColor={"white"}
        fontSize={"lg"}
      >
        {t(topicName)}
      </Button>
    </div>
  );
};

export default function Sidebar({
  prompts,
  handlePromptSelect,
  handlePromptToggle,
}) {
  const { t } = useTranslation();
  const [homeList, setHomeList] = useState([]);
  const [displayList, setDiplayList] = useState([]);

  console.log(homeList);

  useEffect(() => {
    let hl = Object.keys(prompts);
    setHomeList(hl);
    setDiplayList(hl);
  }, [prompts]);

  const setActivePrompt = (promptName) => {
    let children = prompts[promptName]["Prompts"].map(({ Prompt }) => Prompt);
    let randomPrompt = children[Math.floor(Math.random() * children.length)];
    handlePromptSelect(randomPrompt);
  };

  return (
    <div>
      <Box
        className="sidebar"
        left={"10px"}
        top={"10px"}
        bottom={"110px"}
        position={"fixed"}
        w="375px"
        borderWidth={"1.5px"}
        borderColor={"white"}
      >
        <div className="title-sidebar">
          <Text color={"white"} as={"b"} fontSize="xl" fontFamily={"Inter"}>
            {t("Choose a Topic")}
          </Text>
          <CloseIcon
            cursor={"pointer"}
            marginLeft={"auto"}
            marginRight={"3rem"}
            marginTop={"0.5rem"}
            onClick={handlePromptToggle}
            color={"white"}
          />
        </div>
        <div className="title-description">
          <Text color={"white"}>{t("What do you want to talk about?")}</Text>
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
              onClick={() => setActivePrompt(promptName)}
              topicName={promptName}
            />
          ))}
        </Flex>
      </Box>
    </div>
  );
}
