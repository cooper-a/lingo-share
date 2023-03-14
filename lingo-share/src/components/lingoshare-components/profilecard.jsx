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
import { useTranslation } from "react-i18next";

export default function ProfileCard({
  name,
  userId,
  isFriend,
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
          maxW={"339px"}
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
                {userType === "learner" ? "Language Learner" : "Native Speaker"}
              </Text>
              <Text fontSize={"sm"}>
                {interests ? "Interests: " + interests.join(", ") : ""}
              </Text>
            </Stack>
          </Box>
          <Box
            position={"absolute"}
            bottom={"0px"}
            pl={6}
            pr={6}
            pb={6}
            className="font"
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
            {!isFriend ? (
              <Button
                w={"full"}
                mt={3}
                bg={"#363636"}
                color={"white"}
                rounded={"md"}
                onClick={(e) => handleClickManageFriend(e, userId, true)}
              >
                {t("Add as Friend")}
              </Button>
            ) : (
              <Button
                w={"full"}
                mt={3}
                bg={"white"}
                color={"#363636"}
                rounded={"md"}
                onClick={(e) => handleClickManageFriend(e, userId, false)}
                borderWidth={"1px"}
                borderColor={"#363636"}
              >
                {t("Remove Friend")}
              </Button>
            )}
          </Box>
        </Box>
      </Center>
    </div>
  );
}
