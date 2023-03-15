import React from "react";
import {
  AvatarBadge,
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
  ModalFooter,
} from "@chakra-ui/react";
import PrimaryButton from "./primarybutton";
import SecondaryButton from "./secondarybutton";
import TertiaryButton from "./tertiarybutton";
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
      <Modal isCentered onClose={onClose} size={"md"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader marginTop={"1rem"} className="font" alignSelf={"center"}>
            {t("Call ") + displayName + "?"}
          </ModalHeader>
          <ModalFooter marginBottom={"1.5rem"} alignSelf={"center"}>
            <PrimaryButton
              text={t("Yes")}
              marginRight={"15px"}
              onClick={(event) => handleCallConfirm(event, userId)}
              width={"150px"}
            />
            <SecondaryButton
              text={t("No")}
              onClick={onClose}
              marginleft={"15px"}
              width={"150px"}
            />
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
                  <AvatarBadge boxSize="1em" bg="green.500" />
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
                    {t("Online")}
                  </Text>
                ) : (
                  <Text className="font" float={"left"}>
                    {t("Offline")}
                  </Text>
                )}
              </Box>
            </Flex>
            <Box alignSelf={"center"}>
              <TertiaryButton
                onClick={() => handleViewProfile(userId)}
                marginRight={"15px"}
                text={t("View Profile")}
              />
              <PrimaryButton
                marginLeft={"20px"}
                marginRight={"15px"}
                width={"105px"}
                text={t("Call")}
                onClick={() => handleConfirmModuleOpen()}
                isDisabled={onlineStatus === "offline"}
              />
            </Box>
          </Flex>
        </CardHeader>
      </Card>
    </div>
  );
}
