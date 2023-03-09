import * as React from "react";
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
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

export default function CallCard({
  userId,
  onlineStatus,
  displayName,
  disableButton,
  profileURL,
  handleClick,
  handleViewProfile,
}) {
  const { t } = useTranslation();

  return (
    <div>
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
                  <Heading size="sm">{displayName}</Heading>
                ) : (
                  <Heading size="sm">{userId}</Heading>
                )}
                {onlineStatus === "online" ? (
                  <Text float={"left"}>{t("Online")}</Text>
                ) : (
                  <Text float={"left"}>{t("Offline")}</Text>
                )}
              </Box>
            </Flex>
            <Box alignSelf={"center"}>
              <Button
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
                onClick={(event) => handleClick(event, userId)}
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
