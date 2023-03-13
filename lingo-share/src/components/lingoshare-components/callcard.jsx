import React from "react";
import {
  AvatarBadge,
  Button,
  Card,
  CardHeader,
  Heading,
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
  return (
    <div>
      <Modal isCentered onClose={onClose} size={"xs"} isOpen={isOpen}>
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          <ModalHeader alignSelf={"center"}>
            {"Call " + displayName + "?"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter alignSelf={"center"}>
            <Button
              variant={"outline"}
              onClick={(event) => handleCallConfirm(event, userId)}
              marginRight={"5px"}
            >
              Yes
            </Button>
            <Button variant={"outline"} onClick={onClose} marginleft={"5px"}>
              No
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
      <Card bgColor={"#D9D9D9"} width={"700px"}>
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              {onlineStatus === "online" ? (
                <Avatar bg="grey" src={profileURL}>
                  <AvatarBadge boxSize="1.25em" bg="green.500" />
                </Avatar>
              ) : (
                <Avatar bg="grey" src={profileURL} />
              )}

              <Box>
                {displayName ? (
                  <Text fontWeight={"bold"} fontSize="md">
                    {displayName}
                  </Text>
                ) : (
                  <Text fontSize="sm">{userId}</Text>
                )}
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
              <Button
                className="font"
                onClick={(event) => handleViewProfile(userId)}
                isDisabled={false}
                direction="row"
                align="center"
                variant="outline"
                bgColor={"white"}
                marginRight={"15px"}
                borderRadius={"lg"}
              >
                {t("View Profile")}
              </Button>
              <Button
                className="font"
                onClick={() => handleConfirmModuleOpen()}
                isDisabled={disableButton(userId, onlineStatus)}
                direction="row"
                align="center"
                leftIcon={<PhoneIcon w={3} h={3} />}
                variant="outline"
                bgColor={"white"}
                borderRadius={"lg"}
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
