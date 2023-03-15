import React from "react";
import {
  AvatarBadge,
  Button,
  Card,
  CardHeader,
  Avatar,
  Box,
  Text,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

const ConfirmationModal = ({
  isOpen,
  displayName,
  handleCallConfirm,
  userId,
  onClose,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <Modal isCentered onClose={onClose} size={"xs"} isOpen={isOpen}>
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          <ModalHeader alignSelf={"center"}>
            {t("Call ") + displayName + "?"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter alignSelf={"center"}>
            <Button
              variant={"outline"}
              onClick={(event) => handleCallConfirm(event, userId)}
              marginRight={"5px"}
            >
              {t("Yes")}
            </Button>
            <Button variant={"outline"} onClick={onClose} marginleft={"5px"}>
              {t("No")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default function CallCard({
  userId,
  onlineStatus,
  displayName,
  disableButton,
  profileURL,
  userType,
  handleCallClick,
  handleViewProfile,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const handleConfirmModuleOpen = () => {
    onOpen();
  };

  return (
    <div>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        handleCallConfirm={handleCallClick}
        displayName={displayName}
        userId={userId}
      />
      <Card
        className="call-card"
        borderWidth={"1px"}
        borderColor={"#363636"}
        width={"700px"}
        height={"115px"}
        rounded={"2xl"}
      >
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              {onlineStatus === "online" ? (
                <Avatar bg="grey" src={profileURL}>
                  <AvatarBadge boxSize="0.75em" bg="green.500" />
                </Avatar>
              ) : (
                <Avatar bg="grey" src={profileURL} />
              )}

              <Box>
                {displayName ? (
                  <Text float={"left"} fontWeight={"bold"} fontSize="lg">
                    {displayName}
                  </Text>
                ) : (
                  <Text fontSize="sm">{userId}</Text>
                )}
                <Text>
                  {userType === "learner"
                    ? "Language Learner"
                    : "Native Speaker"}
                </Text>
                {onlineStatus === "online" ? (
                  <Text className="font" float={"left"}>
                    {t("• Online")}
                  </Text>
                ) : (
                  <Text className="font" float={"left"}>
                    {t("Offline")}
                  </Text>
                )}
              </Box>
            </Flex>
            <Box alignSelf={"center"}>
              <Button
                className="font"
                onClick={(event) => handleViewProfile(userId)}
                direction="row"
                align="center"
                bgColor={"white"}
                marginRight={"15px"}
                color={"#363636"}
                rounded={"md"}
                textDecoration={"underline"}
                borderRadius={"lg"}
                variant="link"
              >
                {t("View Profile")}
              </Button>
              <Button
                className="font"
                onClick={() => handleConfirmModuleOpen()}
                isDisabled={disableButton(userId, onlineStatus)}
                direction="row"
                width={"100px"}
                align="center"
                variant="outline"
                color={"white"}
                bgColor={"#363636"}
                borderRadius={"lg"}
                ml={"20px"}
                mr={"15px"}
              >
                {t("Call")}
              </Button>
            </Box>
          </Flex>
        </CardHeader>
      </Card>
    </div>
  );
}
