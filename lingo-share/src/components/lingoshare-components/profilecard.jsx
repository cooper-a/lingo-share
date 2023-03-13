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
  handleClickViewProfile,
  handleClickManageFriend,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Center py={6}>
        <Box maxW={"270px"} w={"full"} bg={"#D9D9D9"} rounded={"lg"}>
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
          <Box p={6} className="font">
            <Stack spacing={0} align={"center"} mb={3}>
              <Text className="font" fontSize={"lg"} fontWeight={"bold"}>
                {name}
              </Text>
              {/* <Text color={"gray.500"}>Native Speaker</Text> */}
            </Stack>
            <Button
              w={"full"}
              mt={3}
              bg={"white"}
              color={"black"}
              rounded={"md"}
              onClick={() => handleClickViewProfile(userId)}
            >
              {t("View Profile")}
            </Button>
            {!isFriend ? (
              <Button
                w={"full"}
                mt={3}
                bg={"white"}
                color={"black"}
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
                color={"black"}
                rounded={"md"}
                onClick={(e) => handleClickManageFriend(e, userId, false)}
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
