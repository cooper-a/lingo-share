import * as React from "react";
import {
  Button,
  Text,
  Avatar,
  Box,
  Center,
  Flex,
  Stack,
} from "@chakra-ui/react";
import PrimaryButton from "./primarybutton.jsx";
import SecondaryButton from "./secondarybutton.jsx";
import { useTranslation } from "react-i18next";

export default function ProfileCard({
  name,
  userId,
  isFriend,
  friendRequestSent,
  profileURL,
  userType,
  interests,
  handleClickViewProfile,
  handleClickManageFriend,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Center py={6}>
        <Box
          borderWidth={"1px"}
          borderColor={"#363636"}
          maxW={"260px"}
          height={"380px"}
          w={"full"}
          bg={"white"}
          rounded={"2xl"}
          position={"relative"}
          className="profile-card"
        >
          <Flex justify={"center"} mt={7}>
            <Avatar
              size={"xl"}
              src={
                typeof profileURL !== "undefined"
                  ? profileURL
                  : "https://bit.ly/broken-link"
              }
              alt={"user"}
              bg="#6B6C72"
              css={{
                border: "2px solid white",
              }}
            />
          </Flex>
          <Box pl={6} pr={6} pt={6} className="font">
            <Stack spacing={2} align={"center"} mb={3}>
              <Text className="font" fontSize={"lg"} fontWeight={"bold"}>
                {name}
              </Text>
              <Text>
                {userType === "learner"
                  ? t("Language Learner")
                  : t("Native Speaker")}
              </Text>
            </Stack>
          </Box>
          <Box pl={6} pr={6} pt={0.5} className="font">
            <Text fontSize={"sm"}>
              {interests
                ? t("Interests: ") + interests.slice(0, 3).join(", ") // display the top 3 interests for styling
                : ""}
            </Text>
          </Box>
          <Box
            position={"absolute"}
            bottom={"0px"}
            left={"0px"}
            right={"0px"}
            pl={7}
            pr={7}
            pb={6}
            className="bottom-btns"
            margin={"auto"}
          >
            <Button
              w={"full"}
              variant={"link"}
              mt={3}
              bg={"white"}
              color={"#363636"}
              textDecoration={"underline"}
              onClick={() => handleClickViewProfile(userId)}
            >
              {t("View Profile")}
            </Button>
            {!isFriend && friendRequestSent && (
              <SecondaryButton
                text={t("Friend Request Sent")}
                width="full"
                marginTop={3}
                isDisabled={true}
              />
            )}
            {!isFriend && !friendRequestSent && (
              <PrimaryButton
                text={t("Add as Friend")}
                align={"center"}
                direction={"row"}
                width="full"
                marginTop={3}
                onClick={(e) => handleClickManageFriend(e, userId, true)}
              />
            )}
            {isFriend && !friendRequestSent && (
              <SecondaryButton
                text={t("Remove Friend")}
                width="full"
                marginTop={3}
                onClick={(e) => handleClickManageFriend(e, userId, false)}
              />
            )}
          </Box>
        </Box>
      </Center>
    </div>
  );
}
