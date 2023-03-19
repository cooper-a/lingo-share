import { Box, Button, Flex, Text } from "@chakra-ui/react";
import "../../styles/room.css";
import { useTranslation } from "react-i18next";

const NavItem = ({ topicName, onClick }) => {
  return (
    <div className="inner-topic-btn" onClick={onClick}>
      <Button
        className="topic-btn-clickable"
        width={"250px"}
        height={"50px"}
        variant={"unstyled"}
        bgColor={"white"}
        fontSize={"md"}
      >
        {topicName}
      </Button>
    </div>
  );
};

export default function LeaveConfirmModal({
  handleCallDisconnect,
  handleLeaveToggle,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Box
        className="sidebar"
        right={"10px"}
        bottom={"110px"}
        position={"fixed"}
        w="300px"
        borderWidth={"1px"}
        borderColor={"white"}
      >
        <div className="leave-sidebar-title">
          <Text color={"white"} fontSize="xl">
            {t("Leave the Call?")}
          </Text>
        </div>
        <Flex
          paddingTop={"2rem"}
          paddingLeft={"1rem"}
          paddingBottom={"0.5rem"}
          justifyContent="space-between"
          direction={"column"}
        >
          <NavItem
            onClick={() => handleCallDisconnect()}
            topicName={t("Yes")}
          />
          <NavItem onClick={() => handleLeaveToggle()} topicName={t("No")} />
        </Flex>
      </Box>
    </div>
  );
}
