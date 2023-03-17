import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
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
        rightIcon={<ChevronRightIcon alignContent={"right"} />}
      >
        {t(topicName)}
      </Button>
    </div>
  );
};

const BackButton = ({ onClick }) => {
  return (
    <div className="inner-topic-btn" onClick={onClick}>
      <Button
        className="topic-btn-clickable"
        width={"150px"}
        height={"50px"}
        variant={"unstyled"}
        bgColor={"white"}
        leftIcon={<ChevronLeftIcon alignContent={"left"} />}
      >
        Go Back
      </Button>
    </div>
  );
};

export default function Sidebar({ prompts, handlePromptSelect }) {
  const { t } = useTranslation();
  const [isHomeList, setIsHomeList] = useState(true);
  const [homeList, setHomeList] = useState([]);
  const [displayList, setDiplayList] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");

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
      >
        <div className="title-sidebar">
          <Text as={"b"} fontSize="xl" fontFamily={"Inter"}>
            {t("Choose a Topic")}
          </Text>
        </div>
        <div className="title-description">
          <Text>{t("What do you want to talk about")}</Text>
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
